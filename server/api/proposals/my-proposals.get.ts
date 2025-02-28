import { Product } from '../../models/Product'
import { UserRole } from '../../models/User'

// 定义提案类型
interface Proposal {
  _id: string;
  content: string;
  estimatedTime: string;
  estimatedCost: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  engineer: {
    _id: string;
    name: string;
    avatar: string;
  };
  product: {
    _id: string;
    name: string;
    description: string;
    image: string;
    status: string;
    user: {
      _id: string;
      name: string;
      avatar: string;
    };
  };
}

export default defineEventHandler(async (event) => {
  try {
    // 获取当前登录用户
    const user = event.context.user
    
    // 检查用户是否已登录
    if (!user) {
      return createError({
        statusCode: 401,
        message: '請先登入'
      })
    }
    
    // 检查用户是否有工程师角色
    const hasEngineerRole = user.roles.some((role: any) => 
      role.type === UserRole.ENGINEER && role.isActive
    )
    
    if (!hasEngineerRole) {
      return createError({
        statusCode: 403,
        message: '您需要工程師角色才能查看自己的提案'
      })
    }

    // 查找所有包含该工程师提案的产品
    const products = await Product.find({
      'proposals.engineer._id': user._id
    }).lean()
    
    // 提取该工程师的提案
    const myProposals: Proposal[] = []
    
    products.forEach(product => {
      const proposals = product.proposals
        .filter((proposal: any) => proposal.engineer._id.toString() === user._id.toString())
        .map((proposal: any) => ({
          ...proposal,
          product: {
            _id: product._id,
            name: product.name,
            description: product.description,
            image: product.image,
            status: product.status,
            user: product.user
          }
        }))
      
      myProposals.push(...proposals)
    })
    
    // 按创建时间降序排列
    myProposals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return {
      success: true,
      data: myProposals
    }
  } catch (error) {
    console.error('获取我的提案列表错误:', error)
    return createError({
      statusCode: 500,
      message: '獲取提案列表失敗'
    })
  }
}) 