import axios from 'axios'

//创建axios实例
const request = axios.create({
    baseURL: '/api',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json'
    }
})

//请求拦截器
request.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

//响应拦截器
request.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        return Promise.reject(error)
    }
)


export function post(url, data) {
    return request.post(url, data)
}

export function get(url, params) {
    return request.get(url, { params })
}


//处理流式接口
export async function fetchStream(url, data, onChunk, onError, onComplete) {
    const controller = new AbortController()
    try {
        const response = await fetch(`/api/travel/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            signal: controller.signal
        })

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const text = decoder.decode(value, { stream: true })
            const lines = text.split('\n').filter(line => line.trim())
            for (const line of lines) {
                try {
                    if (line.startsWith('data: ')) {
                        const jsonStr = line.substring(6)
                        const jsonData = JSON.parse(jsonStr)
                        if (jsonData.type === 'chunk') {
                            onChunk(jsonData.content)
                        } else if (jsonData.done) {
                            onComplete(jsonData.data)
                        } else if (jsonData.error) {
                            onError(jsonData.error)
                        }
                    }
                } catch (error) {
                    onError('流式接口解析错误')
                }
            }
        }

        onComplete()
        return controller.abort()

    } catch (error) {
        onError(error.message)
    }
}

