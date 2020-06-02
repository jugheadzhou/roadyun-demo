package com.roadyun.example.handler;

import java.io.*;
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
            inputStreamReader = new InputStreamReader(inputStream, "utf-8");
            bufferedReader = new BufferedReader(inputStreamReader);
            // 获取打印流，用于数据输出；服务器返回数据使用
            outputStream = socket.getOutputStream();
            printWriter = new PrintWriter(outputStream);

            // http请求体
            StringBuilder headStr = new StringBuilder();
            // POST参数
            StringBuilder pramsStr = new StringBuilder();

            // 获取请求体与POST请求的JSON参数
            this.getHttpRequest(bufferedReader,headStr,pramsStr,lineProperty);

            // 关闭输入流
            socket.shutdownInput();

            // 响应
            this.response(printWriter,headStr.toString());

            // 打印请求体和POST参数
            this.print(headStr,pramsStr);

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 连接关闭
            this.close();
        }
        System.out.println("客户端已退出：" + socket.getInetAddress().getHostAddress() + " 端口:" + socket.getPort());
    }

    /**
     * 响应
     * @param printWriter
     * @param content
     */
    private void response(PrintWriter printWriter,String content) {
        printWriter.println("HTTP/1.1 200 OK");
        printWriter.println("Content-Type: text/html;charset=utf-8 ");
        printWriter.println();
        printWriter.println("<html><body><b>");
        printWriter.println(content);
        printWriter.println("</b></body></html>");
        printWriter.flush();
    }

    /**
     * 获取请求体与POST请求的JSON参数
     * @param bufferedReader
     * @param headStr 请求体
     * @param pramsStr 请求参数
     * @param lineProperty 换行符
     * @throws IOException
     */
    private void getHttpRequest(BufferedReader bufferedReader, StringBuilder headStr, StringBuilder pramsStr, String lineProperty) throws IOException {
        while (true){
            String line = bufferedReader.readLine();
            if (line == null){
                break;
            }
            //"".equals(line)表示http头信息读取完成，判断是否包含参数
            if ("".equals(line)) {
                //添加换行符
                headStr.append(lineProperty);
                //读取post请求json参数
                while ((line = bufferedReader.readLine()) != null) {
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
