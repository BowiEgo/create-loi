import { parseURLQuery } from '@/utils/url'

const urlBody = parseURLQuery(location.href)

const isMock = process.env.NODE_ENV === 'development' && urlBody.isMock

/**
 * 获取List
 */
export async function getList() {
  if (isMock) {
    return await fetch(`/mock/list`).then((resp) => {
      return resp.json()
    })
  }
  try {
    return await fetch(`/mock/list`).then((resp) => {
      return resp.json()
    })
  } catch (e) {
    console.error('获取List错误:', JSON.stringify(e))
  }
}
