package com.roadyun.example.server;

import com.roadyun.example.processor.SocketProcessor;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * @ClassName: ServerSocket
 * @Description: socket服务端，接收http请求
 * @Author 2181250231@qq.com
 * @Create 2020/5/25 22:24
 */
public class SocketServer {

    public static void main(String[] args) throws IOException {
        ServerSocket server = new ServerSocket(8889);
        System.out.println("服务器启动成功...");
        System.out.println("服务器地址：" + server.getInetAddress().getHostAddress() +
                " 端口: "      + server.getLocalPort());
        // 等待客户端连接
        while (true) {
            // 得到客户端
            Socket client = server.accept();
            // 构建处理客户端消息的异步线程
            SocketProcessor socketProcessor = new SocketProcessor(client);
            // 启动线程
            socketProcessor.start();
        }
    }
}
