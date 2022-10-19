import { getList } from '@/service'
import { sleep } from '@/utils/base'

function useFetchHomeData(datas, loading) {
  const fetchList = async () => {
    const resp = await getList()

    datas.list.value = resp.data.slice(0, 3)
    console.info('列表', resp)
  }

  Promise.all([fetchList(), sleep(1000)]).then(() => {
    console.log('首页数据加载完毕')
    loading.value = false
  })
}

export { useFetchHomeData }
