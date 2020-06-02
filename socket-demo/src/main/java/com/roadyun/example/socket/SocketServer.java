package com.roadyun.example.socket;

import com.roadyun.example.handler.ClientHandler;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * @ClassName: ServerSocket
 * @Description: socket服务端
 * @Author 2181250231@qq.com
 * @Create 2020/5/25 22:24
 */
public class SocketServer {

    public static void main(String[] args) throws IOException {
        ServerSocket server = new ServerSocket(8888);
        System.out.println("服务器启动成功...");
        System.out.println("服务器地址：" + server.getInetAddress().getHostAddress() +
                " 端口: "      + server.getLocalPort());
        // 等待客户端连接
        while (true) {
            // 得到客户端
            Socket client = server.accept();
            // 构建处理客户端消息的异步线程
            ClientHandler clientHandler = new ClientHandler(client);
            // 启动线程
            clientHandler.start();
        }
    }
}
