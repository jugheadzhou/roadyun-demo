package com.roadyun.example.handler;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.net.Socket;

/**
 * @ClassName: ClientHandler
 * @Description:
 * @Author 2181250231@qq.com
 * @Create 2020/6/122:44
 */
public class ClientHandler extends Thread {
    /**
     * 换行符
     */
    private static String lineProperty = System.getProperty("line.separator");
    private Socket socket;

    public ClientHandler(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void run() {
        super.run();
        System.out.println("新客户端连接：" + socket.getInetAddress().getHostAddress() + " 端口:" + socket.getPort());
        PrintStream socketOutput = null;
        BufferedReader socketInput = null;
        try {
            // 获取输入流，用于接收数据
            socketInput = new BufferedReader(new InputStreamReader(socket.getInputStream(),"utf-8"));
            // 获取打印流，用于数据输出；服务器返回数据使用
            socketOutput = new PrintStream(socket.getOutputStream());

            // http请求体
            StringBuilder headStr = new StringBuilder();
            // POST参数
            StringBuilder pramsStr = new StringBuilder();

            // 获取请求体与POST请求的JSON参数
            this.getHttpRequest(socketInput,headStr,pramsStr,lineProperty);

            this.send(socketOutput);
            // 打印请求体和POST参数
            this.print(headStr,pramsStr);

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 连接关闭
            this.close(socketInput,socketOutput);
        }
        System.out.println("客户端已退出：" + socket.getInetAddress().getHostAddress() + " 端口:" + socket.getPort());
    }

    private void send(PrintStream socketOutput) {
        StringBuilder header = new StringBuilder();
        header.append("HTTP/1.1 404 NOT FOUND ");
        header.append(lineProperty);
        header.append("Content-Type: text/html;charset=utf-8");
        header.append(lineProperty);
        header.append(lineProperty);
        System.out.println("-----------响应头---------");
        System.out.println(header.toString());
        socketOutput.println(header.toString());
        String body = "<h1>NOT FOUND</h1>";
        socketOutput.println(body);
    }

    /**
     * 获取请求体与POST请求的JSON参数
     * @param socketInput
     * @param headStr 请求体
     * @param pramsStr 请求参数
     * @param lineProperty 换行符
     * @throws IOException
     */
    private void getHttpRequest(BufferedReader socketInput, StringBuilder headStr, StringBuilder pramsStr, String lineProperty) throws IOException {
        while (true){
            String line = socketInput.readLine();
            //"".equals(line)表示http头信息读取完成，判断是否包含参数
            if ("".equals(line)) {
                //添加换行符
                headStr.append(lineProperty);
                //读取post请求json参数
                while ((line = socketInput.readLine()) != null) {
                    headStr.append(line);
                    headStr.append(lineProperty);
                    pramsStr.append(line);
                    pramsStr.append(lineProperty);
                }
                break;
            } else {
                //读取请求体头
                headStr.append(line);
                headStr.append(lineProperty);
            }
        }
    }

    /**
     * 打印请求体和POST参数
     * @param headStr
     * @param pramsStr
     */
    private void print(StringBuilder headStr, StringBuilder pramsStr) {
        if (headStr.length() > 0) {
            System.out.println("-----------HTTP请求体---------------");
            System.out.println(headStr.toString());
        }
        if (pramsStr.length() > 0) {
            System.out.println("-----------POST请求参数--------------");
            System.out.println(pramsStr.toString());
        }
    }

    /**
     * 连接关闭
     * @param socketInput
     * @param socketOutput
     */
    private void close(BufferedReader socketInput, PrintStream socketOutput) {
        try {
            if (socketInput != null) {
                socketInput.close();
            }
            if (socketOutput != null) {
                socketOutput.close();
            }
            socket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
