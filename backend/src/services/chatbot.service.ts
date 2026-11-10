import { GoogleGenerativeAI } from '@google/generative-ai'
import { CourseLevel, CourseStatus } from '../enums'
import { Course } from '../models/course'
import { Order } from '../models/order'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

interface CourseData {
  _id: string
  title: string
  description?: string
  price: number
  oldPrice?: number
  image?: string
  level: CourseLevel
  slug?: string
  view?: number
  status: CourseStatus
  author?: { username: string; email: string }
  category?: { name: string }
  matchScore?: number
}

interface ChatMessage {
  message: string
  response: string
  intent: string
  courses?: Array<{
    id: string
    title: string
    price: number
    oldPrice?: number
    image?: string
    level: CourseLevel
    author: string
    view: number
  }>
  suggestions: string[]
  timestamp: Date
}

interface ChatbotResponse {
  response: string
  courses?: Array<{
    id: string
    title: string
    price: number
    oldPrice?: number
    image?: string
    level: CourseLevel
    author: string
    view: number
  }>
  suggestions: string[]
  intent: 'course_search' | 'pricing' | 'policy' | 'support' | 'complaint' | 'general' | 'off_topic' | 'order_status'
}

export class CourseChatbotService {
  private genAI: GoogleGenerativeAI | null = null
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null
  private chatHistory: Map<string, ChatMessage[]> = new Map()

  constructor() {
    this.initializeGemini()
  }

  private initializeGemini(): void {
    try {
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'demo-key') {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        this.model = this.genAI.getGenerativeModel({
          model: 'gemini-2.0-flash'
        })
        console.info('✅ Gemini AI initialized successfully with model: gemini-2.0-flash')
      } else {
        console.warn('⚠️  Gemini API key not found, using fallback responses')
      }
    } catch (error) {
      console.error('❌ Failed to initialize Gemini AI:', error)
    }
  }

  /**
   * Main chatbot handler with AI intelligence
   */
  async handleMessage(message: string, userId: string): Promise<ChatbotResponse> {
    try {
      const allCourses = await this.getAllCourses()
      const userHistory = this.getUserHistory(userId)
      const aiResponse = await this.getAIResponse(message, allCourses, userHistory)

      if (aiResponse.intent === 'order_status') {
        const enhancedResponse = await this.handleOrderStatusQuery(message, userId)
        aiResponse.response = enhancedResponse.response
        aiResponse.suggestions = enhancedResponse.suggestions
      }

      this.saveToHistory(userId, message, aiResponse)

      return aiResponse
    } catch (error) {
      console.error('Course chatbot error:', error)
      return this.getFallbackResponse(message)
    }
  }

  /**
   * Get user's chat history
   */
  private getUserHistory(userId: string): ChatMessage[] {
    return this.chatHistory.get(userId) || []
  }

  /**
   * Handle order status queries with enhanced logic
   */
  private async handleOrderStatusQuery(
    message: string,
    userId: string
  ): Promise<{ response: string; suggestions: string[] }> {
    const lowerMessage = message.toLowerCase()

    // Check if user provided a specific order code with better context awareness
    let orderCode: string | null = null

    // First, check if they're asking for general order history (exclude these cases)
    const generalOrderQueries = [
      'một số đơn hàng',
      'đơn hàng gần đây',
      'lịch sử đơn hàng',
      'tất cả đơn hàng',
      'các đơn hàng',
      'danh sách đơn hàng',
      'xem đơn hàng'
    ]

    const isGeneralQuery = generalOrderQueries.some((query) => lowerMessage.includes(query))

    if (!isGeneralQuery) {
      // Only look for specific order codes when it's not a general query
      // More specific patterns for order codes
      const specificOrderPatterns = [
        /(?:kiểm tra|check|tra cứu|tìm)\s*(?:đơn hàng|order)\s*(?:mã|code)?\s*[:\s]*([A-Z0-9]{6,20})/i,
        /(?:đơn hàng|order)\s*(?:mã|code|số)\s*[:\s]*([A-Z0-9]{6,20})/i,
        /(?:mã|code)\s*(?:đơn hàng|order)\s*[:\s]*([A-Z0-9]{6,20})/i,
        /([A-Z0-9]{6,20})(?:\s*là\s*(?:đơn hàng|order))/i
      ]

      for (const pattern of specificOrderPatterns) {
        const match = lowerMessage.match(pattern)
        if (match && match[1]) {
          // Additional validation: ensure it looks like an order code
          const potentialCode = match[1].toUpperCase()
          if (potentialCode.length >= 6 && potentialCode.length <= 20 && /^[A-Z0-9-_]+$/.test(potentialCode)) {
            orderCode = potentialCode
            break
          }
        }
      }
    }

    if (orderCode) {
      // User provided specific order code - lookup that order
      try {
        const order = await Order.findOne({
          code: orderCode.toUpperCase()
        }).populate({
          path: 'items.courseId',
          select: 'title image price'
        })

        if (order) {
          // Check if this order belongs to the current user
          if (order.userId.toString() !== userId) {
            return {
              response: `❌ Không tìm thấy đơn hàng với mã: ${orderCode.toUpperCase()}\n\nVui lòng kiểm tra lại mã đơn hàng hoặc liên hệ hỗ trợ nếu bạn cần trợ giúp.`,
              suggestions: [
                'Xem đơn hàng của tôi 📋',
                'Kiểm tra lại mã đơn hàng 🔍',
                'Liên hệ hỗ trợ 🛠️',
                'Tìm khóa học mới 📚'
              ]
            }
          }

          // Format course list
          const coursesList = order.items
            .map((item, index) => {
              const courseTitle = item.title || 'Khóa học'
              const coursePrice = item.price?.toLocaleString('vi-VN') || '0'
              return `${index + 1}. ${courseTitle} - ${coursePrice}đ`
            })
            .join('\n')

          // Format status in Vietnamese
          const statusMap: Record<string, string> = {
            pending: '⏳ Chờ thanh toán',
            completed: '✅ Hoàn thành',
            cancelled: '❌ Đã hủy',
            processing: '🔄 Đang xử lý',
            failed: '💥 Thất bại'
          }
          const statusDisplay = statusMap[order.status] || order.status

          return {
            response: `📦 **Thông tin đơn hàng ${orderCode.toUpperCase()}:**\n\n📚 **Khóa học:**\n${coursesList}\n\n📊 **Chi tiết:**\n• **Trạng thái:** ${statusDisplay}\n• **Ngày tạo:** ${new Date(order.createdAt).toLocaleDateString('vi-VN')}\n• **Tổng tiền:** ${order.totalAmount?.toLocaleString('vi-VN')}đ\n${order.totalDiscount > 0 ? `• **Giảm giá:** ${order.totalDiscount?.toLocaleString('vi-VN')}đ\n` : ''}${order.couponCode ? `• **Mã giảm giá:** ${order.couponCode}\n` : ''}\n💡 Để xem chi tiết đầy đủ, vui lòng vào "Tài khoản của tôi" → "Đơn hàng"`,
            suggestions: [
              'Xem tất cả đơn hàng 📋',
              'Tìm khóa học mới 🔍',
              'Liên hệ hỗ trợ 🛠️',
              'Hướng dẫn thanh toán 💳'
            ]
          }
        } else {
          return {
            response: `❌ Không tìm thấy đơn hàng với mã: ${orderCode.toUpperCase()}\n\nVui lòng kiểm tra lại mã đơn hàng hoặc:\n• Liên hệ hỗ trợ: +84 929465329\n• Telegram: @yolo7phan\n• Email: support@yolo.com\n• Xem tất cả đơn hàng của bạn`,
            suggestions: [
              'Xem đơn hàng của tôi 📋',
              'Kiểm tra lại mã đơn hàng 🔍',
              'Liên hệ Telegram 📱',
              'Tìm khóa học mới 📚'
            ]
          }
        }
      } catch (orderError) {
        console.error('Error fetching order by code:', orderError)
        return {
          response: `❌ Có lỗi khi kiểm tra đơn hàng ${orderCode.toUpperCase()}\n\nVui lòng thử lại sau hoặc liên hệ hỗ trợ qua Telegram @yolo7phan.`,
          suggestions: ['Thử lại 🔄', 'Liên hệ Telegram 📱', 'Xem đơn hàng của tôi 📋', 'Tìm khóa học mới 📚']
        }
      }
    } else {
      // No specific order code - show user's order history
      try {
        // Convert userId to ObjectId for proper matching
        const userObjectId = new mongoose.Types.ObjectId(userId)

        const userOrders = await Order.find({ userId: userObjectId })
          .populate({
            path: 'items.courseId',
            select: 'title image'
          })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean()

        if (userOrders.length > 0) {
          const orderList = userOrders
            .map((order) => {
              const firstItem = order.items[0]
              const courseName = firstItem?.title || 'Khóa học'
              const statusMap: Record<string, string> = {
                pending: '⏳ Chờ thanh toán',
                completed: '✅ Hoàn thành',
                cancelled: '❌ Đã hủy',
                processing: '🔄 Đang xử lý',
                failed: '💥 Thất bại'
              }
              const statusDisplay = statusMap[order.status] || order.status
              const totalCourses = order.items.length
              const courseText = totalCourses > 1 ? `${courseName} (+${totalCourses - 1} khóa khác)` : courseName

              return `• **${order.code}** - ${courseText}\n  ${statusDisplay} - ${order.totalAmount?.toLocaleString('vi-VN')}đ (${new Date(order.createdAt).toLocaleDateString('vi-VN')})`
            })
            .join('\n\n')

          return {
            response: `📦 **Lịch sử đơn hàng của bạn:**\n\n${orderList}\n\n💡 **Cách kiểm tra chi tiết:**\n• Nhập: "Kiểm tra đơn hàng [MÃ_ĐƠN_HÀNG]"\n• Ví dụ: "Kiểm tra đơn hàng ${userOrders[0].code}"\n• Hoặc vào "Tài khoản của tôi" → "Đơn hàng"`,
            suggestions: [
              `Kiểm tra ${userOrders[0].code} 📋`,
              'Xem tất cả đơn hàng 📋',
              'Liên hệ hỗ trợ 🛠️',
              'Tìm khóa học mới 📚'
            ]
          }
        } else {
          return {
            response: `📦 **Bạn chưa có đơn hàng nào.**\n\nHãy khám phá các khóa học tuyệt vời của chúng tôi và bắt đầu hành trình học tập!\n\n🎯 **Gợi ý:**\n• Xem các khóa học hot nhất\n• Tìm khóa học miễn phí\n• Nhận tư vấn lộ trình học tập`,
            suggestions: ['Xem khóa học hot 🔥', 'Khóa học miễn phí 🆓', 'Tư vấn lộ trình 💫', 'Liên hệ tư vấn 📱']
          }
        }
      } catch (orderError) {
        console.error('Error fetching user orders:', orderError)
        return {
          response: `❌ Có lỗi khi tải lịch sử đơn hàng.\n\nVui lòng thử lại sau hoặc liên hệ hỗ trợ qua Telegram @yolo7phan.`,
          suggestions: ['Thử lại 🔄', 'Liên hệ Telegram 📱', 'Tìm khóa học mới 📚', 'Về trang chủ 🏠']
        }
      }
    }
  }

  /**
   * Save message to chat history
   */
  private saveToHistory(userId: string, message: string, response: ChatbotResponse): void {
    const userHistory = this.chatHistory.get(userId) || []

    const chatMessage: ChatMessage = {
      message,
      response: response.response,
      intent: response.intent,
      courses: response.courses,
      suggestions: response.suggestions,
      timestamp: new Date()
    }

    userHistory.push(chatMessage)

    // Keep only last 50 messages per user
    if (userHistory.length > 50) {
      userHistory.splice(0, userHistory.length - 50)
    }

    this.chatHistory.set(userId, userHistory)
  }

  /**
   * Get AI response using Gemini
   */
  private async getAIResponse(
    userMessage: string,
    courses: CourseData[],
    userHistory: ChatMessage[]
  ): Promise<ChatbotResponse> {
    if (!this.model) {
      return this.getFallbackResponse(userMessage)
    }

    try {
      const prompt = this.createPrompt(userMessage, courses, userHistory)
      const result = await this.model.generateContent(prompt)

      const response = await result.response
      const aiText = response.text()

      const parsedResponse = this.parseAIResponse(aiText, courses)
      return parsedResponse
    } catch (error) {
      console.error('❌ Gemini API error:', error)
      return this.getFallbackResponse(userMessage)
    }
  }

  /**
   * Create comprehensive prompt for Gemini AI
   */
  private createPrompt(userMessage: string, courses: CourseData[], userHistory: ChatMessage[]): string {
    const courseList = courses
      .map(
        (c) =>
          `- ${c.title}: ${c.description?.substring(0, 100)}... (Giá: ${c.price?.toLocaleString('vi-VN')}đ, Level: ${c.level})`
      )
      .join('\n')

    // Build conversation history
    const conversationHistory = userHistory
      .slice(-5) // Last 5 messages
      .map((msg) => `User: ${msg.message}\nBot: ${msg.response}`)
      .join('\n')

    return `
Bạn là một trợ lý AI thông minh cho nền tảng học trực tuyến YOLO Learning. Bạn có thể xử lý mọi loại câu hỏi về khóa học:

KHẢ NĂNG CỦA BẠN:
1. Tìm kiếm và gợi ý khóa học phù hợp
2. Trả lời câu hỏi về giá cả, chính sách
3. Hỗ trợ học viên với mọi thắc mắc
4. Tư vấn lộ trình học tập
5. Xử lý khiếu nại và phản hồi
6. Trò chuyện thân thiện, tự nhiên
7. Trả lời câu hỏi kiến thức chung một cách thông minh và hài hước
8. Kiểm tra trạng thái đơn hàng và lịch sử mua khóa học
9. Hướng dẫn học viên liên hệ admin và hỗ trợ

DANH SÁCH KHÓA HỌC CÓ SẴN:
${courseList}

LỊCH SỬ TRÒ CHUYỆN:
${conversationHistory}

THÔNG TIN NỀN TẢNG:
- Tên: YOLO Learning - Nền tảng học trực tuyến
- Chuyên: Khóa học lập trình, thiết kế, marketing, kinh doanh
- Chính sách: Hoàn tiền trong 30 ngày, học trọn đời
- Thanh toán: Thẻ tín dụng, chuyển khoản, ví điện tử
- Hỗ trợ: 24/7 qua chat, email: support@yolo.com
- Admin Telegram: @yolo7phan - Liên hệ trực tiếp với admin
- Hotline: +84 929465329 - Hỗ trợ khẩn cấp
- Cấp độ: Beginner, Intermediate, Advanced

TIN NHẮN HỌC VIÊN: "${userMessage}"

HƯỚNG DẪN TRẢ LỜI:
- Nếu hỏi về KHÓA HỌC: Tìm và gợi ý khóa học phù hợp
- Nếu hỏi về GIÁ CẢ: So sánh giá, gợi ý khóa học trong tầm giá
- Nếu hỏi về CHÍNH SÁCH: Giải thích rõ ràng về hoàn tiền, học trọn đời
- Nếu hỏi về LỘ TRÌNH: Tư vấn lộ trình học tập phù hợp
- Nếu KHIẾU NẠI: Thể hiện sự quan tâm, hướng dẫn giải quyết
- Nếu HỎI CHUNG: Trò chuyện thân thiện, hướng về khóa học
- Nếu HỎI NGOÀI LĨNH VỰC: Trả lời thông minh, hài hước và thân thiện
- Nếu HỎI VỀ ĐƠN HÀNG: Hướng dẫn kiểm tra trạng thái đơn hàng, lịch sử mua khóa học

Hãy trả lời theo format JSON sau:
{
  "response": "Câu trả lời ngắn gọn, xúc tích, thân thiện và hữu ích",
  "matchedCourses": ["tên khóa học 1", "tên khóa học 2", ...],
  "suggestions": ["gợi ý 1", "gợi ý 2", "gợi ý 3", "gợi ý 4"],
  "intent": "course_search|pricing|policy|support|complaint|general|off_topic|order_status"
}

LƯU Ý QUAN TRỌNG:
- Luôn trả lời bằng tiếng Việt tự nhiên
- Sử dụng emoji phù hợp để tạo cảm xúc
- Nếu không biết thông tin cụ thể, hãy thành thật và hướng dẫn liên hệ
- Với câu hỏi ngoài lề, hãy trả lời thông minh, hài hước và thân thiện trước, sau đó mới chuyển hướng về khóa học
- Thể hiện sự quan tâm và sẵn sàng hỗ trợ
- Đừng từ chối trả lời các câu hỏi kiến thức chung, hãy trả lời một cách thông minh và hài hước
`
  }

  /**
   * Parse AI response and match with actual courses
   */
  private parseAIResponse(aiText: string, courses: CourseData[]): ChatbotResponse {
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])

        const matchedCourses: CourseData[] = []
        if (parsed.matchedCourses && Array.isArray(parsed.matchedCourses)) {
          parsed.matchedCourses.forEach((courseTitle: string) => {
            const course = courses.find(
              (c) =>
                c.title.toLowerCase().includes(courseTitle.toLowerCase()) ||
                courseTitle.toLowerCase().includes(c.title.toLowerCase())
            )
            if (course) {
              matchedCourses.push({
                _id: course._id,
                title: course.title,
                description: course.description,
                price: course.price,
                oldPrice: course.oldPrice,
                image: course.image,
                level: course.level,
                slug: course.slug,
                view: course.view,
                status: course.status,
                author: course.author,
                category: course.category
              })
            }
          })
        }

        return {
          response: parsed.response || 'Tôi có thể giúp bạn tìm khóa học phù hợp!',
          courses: matchedCourses.map((course) => ({
            id: course._id.toString(),
            title: course.title,
            price: course.price,
            oldPrice: course.oldPrice,
            image: course.image,
            level: course.level,
            author: course.author?.username || 'Unknown',
            view: course.view || 0
          })),
          suggestions: parsed.suggestions || [
            'Xem tất cả khóa học',
            'Khóa học miễn phí',
            'Hỗ trợ đăng ký',
            'Liên hệ tư vấn'
          ],
          intent: parsed.intent || 'general'
        }
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error)
    }

    return this.simpleKeywordMatch(aiText, courses)
  }

  /**
   * Simple keyword matching fallback
   */
  private simpleKeywordMatch(userMessage: string, courses: CourseData[]): ChatbotResponse {
    const lowerMessage = userMessage.toLowerCase().trim()
    const matchedCourses: CourseData[] = []

    const searchTerms = lowerMessage.split(' ').filter((term) => term.length > 1)
    searchTerms.push(lowerMessage)

    const keywordMapping: Record<string, string[]> = {
      javascript: ['javascript', 'js', 'react', 'nodejs'],
      python: ['python', 'django', 'flask'],
      web: ['web', 'html', 'css', 'frontend'],
      mobile: ['mobile', 'android', 'ios']
    }

    const expandedTerms = [...searchTerms]
    Object.keys(keywordMapping).forEach((enTerm) => {
      if (lowerMessage.includes(enTerm)) {
        expandedTerms.push(...keywordMapping[enTerm])
      }
    })

    courses.forEach((course) => {
      let matchScore = 0
      const courseTitle = course.title?.toLowerCase() || ''
      const courseDesc = course.description?.toLowerCase() || ''

      expandedTerms.forEach((term) => {
        if (courseTitle.includes(term.toLowerCase())) {
          matchScore += 10
        }
        if (courseDesc.includes(term.toLowerCase())) {
          matchScore += 8
        }
      })

      if (matchScore > 0) {
        matchedCourses.push({ ...course, matchScore })
      }
    })

    matchedCourses.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))

    const uniqueCourses = matchedCourses.filter(
      (course, index, self) => index === self.findIndex((c) => c._id.toString() === course._id.toString())
    )

    if (uniqueCourses.length > 0) {
      const courseList = uniqueCourses
        .slice(0, 5)
        .map((c) => `• ${c.title} - ${c.price?.toLocaleString('vi-VN')}đ`)
        .join('\n')

      return {
        response: `🔍 Tôi tìm thấy ${uniqueCourses.length} khóa học phù hợp với "${userMessage}":\n\n${courseList}\n\nBạn muốn xem chi tiết khóa học nào không?`,
        courses: uniqueCourses.slice(0, 3).map((course) => ({
          id: course._id.toString(),
          title: course.title,
          price: course.price,
          oldPrice: course.oldPrice,
          image: course.image,
          level: course.level,
          author: course.author?.username || 'Unknown',
          view: course.view || 0
        })),
        suggestions: ['Xem tất cả khóa học', 'Lọc theo cấp độ', 'Khóa học miễn phí', 'Đăng ký học'],
        intent: 'course_search'
      }
    }

    return this.getFallbackResponse(userMessage)
  }

  /**
   * Get all courses from database
   */
  private async getAllCourses(): Promise<CourseData[]> {
    try {
      const courses = await Course.aggregate([
        { $match: { status: CourseStatus.PUBLISHED } },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
            pipeline: [{ $project: { username: 1, email: 1, avatar: 1 } }]
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
            pipeline: [{ $project: { name: 1 } }]
          }
        },
        {
          $addFields: {
            author: { $arrayElemAt: ['$author', 0] },
            category: { $arrayElemAt: ['$category', 0] }
          }
        },
        { $limit: 100 },
        { $sort: { createdAt: -1 } }
      ])

      return courses
    } catch (error) {
      console.error('Error fetching courses:', error)
      return []
    }
  }

  /**
   * Enhanced fallback response for various scenarios
   */
  private getFallbackResponse(userMessage: string): ChatbotResponse {
    const lowerMessage = userMessage.toLowerCase()

    // Course search patterns
    if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
      return {
        response: '💻 Tìm thấy nhiều khóa học JavaScript! Từ cơ bản đến nâng cao, React, Node.js...',
        suggestions: ['JavaScript cơ bản', 'React.js', 'Node.js', 'Xem tất cả JS'],
        intent: 'course_search'
      }
    }

    if (lowerMessage.includes('python')) {
      return {
        response: '🐍 Python rất phổ biến! Có khóa học từ cơ bản đến AI/ML.',
        suggestions: ['Python cơ bản', 'Django', 'Data Science', 'Xem tất cả Python'],
        intent: 'course_search'
      }
    }

    if (lowerMessage.includes('web') || lowerMessage.includes('frontend')) {
      return {
        response: '🌐 Web development rất thú vị! HTML, CSS, JavaScript, React...',
        suggestions: ['Frontend cơ bản', 'React.js', 'Fullstack', 'Xem tất cả web'],
        intent: 'course_search'
      }
    }

    if (lowerMessage.includes('giá') || lowerMessage.includes('bao nhiêu')) {
      return {
        response: '💰 Khóa học đa dạng từ miễn phí đến 2M! Bạn muốn tìm trong tầm giá nào?',
        suggestions: ['Miễn phí 🆓', 'Dưới 500k', 'Từ 500k-1M', 'Xem khuyến mãi'],
        intent: 'pricing'
      }
    }

    if (lowerMessage.includes('hoàn tiền') || lowerMessage.includes('chính sách')) {
      return {
        response:
          '📋 Chính sách:\n• Hoàn tiền 30 ngày\n• Học trọn đời\n• Hỗ trợ 24/7\n• Telegram: @YoloLearningSupport',
        suggestions: ['Cách hoàn tiền', 'Chứng chỉ', 'Thời gian học', 'Liên hệ hỗ trợ'],
        intent: 'policy'
      }
    }

    if (lowerMessage.includes('lộ trình') || lowerMessage.includes('học')) {
      return {
        response: '🎯 Tôi sẽ giúp xây dựng lộ trình học phù hợp! Bạn muốn học gì?',
        suggestions: ['Frontend', 'Backend', 'Fullstack', 'Tư vấn chi tiết'],
        intent: 'support'
      }
    }

    if (lowerMessage.includes('liên hệ') || lowerMessage.includes('hỗ trợ') || lowerMessage.includes('support')) {
      return {
        response:
          '📞 Liên hệ hỗ trợ YOLO Learning:\n\n• 💬 Chat trực tiếp: Ngay tại đây\n• 📧 Email: support@yolo.com\n• 📱 Telegram: @yolo7phan\n• ☎️ Hotline: +84 929465329\n\nChúng tôi hỗ trợ 24/7! 💪',
        suggestions: ['Chat ngay 💬', 'Gọi hotline ☎️', 'Telegram @yolo7phan', 'Email hỗ trợ 📧'],
        intent: 'support'
      }
    }

    if (lowerMessage.includes('telegram') || lowerMessage.includes('tele')) {
      return {
        response:
          '📱 Kết nối với YOLO Learning qua Telegram:\n\n• 👨‍💼 Admin: @yolo7phan\n• 🆘 Hỗ trợ khẩn cấp: +84 929465329\n\nTelegram là cách nhanh nhất để nhận hỗ trợ! ⚡',
        suggestions: ['Liên hệ admin 👨‍💼', 'Chat trực tiếp 💬', 'Gọi hotline ☎️', 'Email hỗ trợ 📧'],
        intent: 'support'
      }
    }

    if (lowerMessage.includes('chào') || lowerMessage.includes('hello')) {
      return {
        response:
          'Chào bạn! 👋 Tôi là trợ lý AI của YOLO Learning. Bạn cần hỗ trợ gì?\n\n💡 Tip: Liên hệ trực tiếp qua Telegram @yolo7phan để được hỗ trợ nhanh nhất!',
        suggestions: ['Khóa học hot 🔥', 'Khuyến mãi 🎉', 'Liên hệ Telegram 📱', 'Xem tất cả 📚'],
        intent: 'general'
      }
    }

    return {
      response:
        'Tôi là trợ lý AI của YOLO Learning! 😊 Tôi có thể giúp bạn tìm khóa học, tư vấn lộ trình, hỗ trợ chính sách...\n\n📱 Liên hệ trực tiếp: @yolo7phan trên Telegram hoặc gọi +84 929465329',
      suggestions: ['Tìm khóa học 🔍', 'Liên hệ Telegram 📱', 'Chính sách 📋', 'Tư vấn lộ trình 🎯'],
      intent: 'general'
    }
  }

  /**
   * Get chat history for a user
   */
  getChatHistory(userId: string): ChatMessage[] {
    return this.getUserHistory(userId)
  }

  /**
   * Clear chat history for a user
   */
  clearChatHistory(userId: string): void {
    this.chatHistory.delete(userId)
  }
}

export default new CourseChatbotService()
