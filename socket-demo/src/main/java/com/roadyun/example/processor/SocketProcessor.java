package com.roadyun.example.processor;

import java.io.*;
import java.net.Socket;

/**
 * @ClassName: Acceptor
 * @Description: 解析请求体
 * @Author 2181250231@qq.com
 * @Create 2020/6/122:44
 */
public class SocketProcessor extends Thread {
    private Socket socket;

    public SocketProcessor(Socket socket) {
        this.socket = socket;
    }

    InputStream inputStream = null;
    InputStreamReader inputStreamReader = null;
    BufferedReader bufferedReader = null;
    PrintWriter printWriter = null;
    OutputStream outputStream = null;

    @Override
    public void run() {
        super.run();
        System.out.println("新客户端连接：" + socket.getInetAddress().getHostAddress() + " 端口:" + socket.getPort());
        try {
            // 获取输入流，用于接收数据
            inputStream = socket.getInputStream();
            inputStreamReader = new InputStreamReader(inputStream, "UTF-8");
            bufferedReader = new BufferedReader(inputStreamReader);
            // 获取打印流，用于数据输出；服务器返回数据使用
            outputStream = socket.getOutputStream();
            printWriter = new PrintWriter(outputStream);

            // 封装请求体对象
            HttpRequestProcessor request = new HttpRequestProcessor(inputStream);
            // 封装响应体对象
            HttpResponseProcessor response = new HttpResponseProcessor(printWriter);

            // 模拟请求分发
            dispatch(request, response);

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 连接关闭
            this.close();
        }
        System.out.println("客户端已退出：" + socket.getInetAddress().getHostAddress() + " 端口:" + socket.getPort());
    }

    /**
     * 模拟请求分发
     *
     * @param request
     * @param response
     */
    private void dispatch(HttpRequestProcessor request, HttpResponseProcessor response) {
        // 测试 将请求体内容返给浏览器
        response.write(request.getHttpRequest().toString());
    }

    /**
     * 连接关闭
     */
    private void close() {
        try {
            if (printWriter != null) {
                inputStream.close();
            }
            if (printWriter != null) {
                inputStreamReader.close();
            }
            if (printWriter != null) {
                outputStream.close();
            }
            if (printWriter != null) {
                bufferedReader.close();
            }
            if (printWriter != null) {
                printWriter.close();
            }
            socket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
