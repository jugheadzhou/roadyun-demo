package com.roadyun.example.socket;

import java.io.*;
import java.net.Inet4Address;
import java.net.InetSocketAddress;
import java.net.Socket;

/**
 * @ClassName: ClientSocket
 * @Description: 客户端socket
 * @Author 2181250231@qq.com
 * @Create 2020/5/25 22:22
 */
public class SocketClient {
    public static void main(String[] args) throws IOException {
        Socket socket = new Socket();
        // 超时时间
        socket.setSoTimeout(4000);
        // 连接本地，端口2000；超时时间4000ms
        System.out.println("客户端地址：" + socket.getLocalAddress().getHostAddress()+ " 端口:" + socket.getLocalPort());

        System.out.println("开始发起服务端连接");
        socket.connect(new InetSocketAddress(Inet4Address.getLocalHost(), 8888), 4000);
        System.out.println("服务器地址：" + socket.getInetAddress().getHostAddress() + " 端口:" + socket.getPort());

        //处理发送消息和接收消息
        handle(socket);

        // 释放资源
        socket.close();
        System.out.println("客户端已退出。");

    }

    /**
     * 处理发送消息和接收消息
     *
     * @param client
     * @throws IOException
     */
    private static void handle(Socket client) throws IOException {
        PrintStream socketPrintStream = null;
        BufferedReader socketBufferedReader = null;
        try {
            // 构建键盘输入流
            InputStream in = System.in;
            BufferedReader input = new BufferedReader(new InputStreamReader(in));

            // 得到Socket输出流
            OutputStream outputStream = client.getOutputStream();
            //获得打印流
            socketPrintStream = new PrintStream(outputStream);

            // 得到Socket输入流
            InputStream inputStream = client.getInputStream();
            //获得字符缓存输入流 BufferedReader
            socketBufferedReader = new BufferedReader(new InputStreamReader(inputStream));

            while (true) {
                // 键盘读取一行
                String str = input.readLine();
                // 发送到服务器
                socketPrintStream.println(str);
                // 从服务器读取一行
                String echo = socketBufferedReader.readLine();
                System.out.println(echo);
            }
        } catch (IOException e) {
            System.out.println("Socket异常关闭");
        } finally {
            // 资源释放
            if (socketPrintStream != null) {
                socketPrintStream.close();
            }
            if (socketBufferedReader != null) {
                socketBufferedReader.close();
            }
        }


    }
}
