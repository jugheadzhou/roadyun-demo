package com.roadyun.example.processor;

import com.roadyun.example.common.Constant;

import java.io.*;
import java.net.Socket;
import java.util.Map;

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
            inputStreamReader = new InputStreamReader(inputStream, "utf-8");
            bufferedReader = new BufferedReader(inputStreamReader);
            // 获取打印流，用于数据输出；服务器返回数据使用
            outputStream = socket.getOutputStream();
            printWriter = new PrintWriter(outputStream);

            HttpRequestProcessor httpRequestProcessor = new HttpRequestProcessor(inputStream);
            Map<String, String> httpRequest = httpRequestProcessor.getHttpRequest();
//            System.out.println("httpRequest: ");
//            System.out.println(httpRequest.toString());

//            // http请求体
//            StringBuilder headStr = new StringBuilder();
//            // POST参数
//            StringBuilder pramsStr = new StringBuilder();
//
//            // 获取请求体与POST请求的JSON参数
//            this.getHttpRequest(headStr,pramsStr);

            // 关闭输入流
            socket.shutdownInput();

            // 响应
            this.response(printWriter,httpRequest.toString());

            // 打印请求体和POST参数
//            this.print(headStr,pramsStr);

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
     * @param headStr 请求体
     * @param pramsStr 请求参数
     * @throws IOException
     */
    private void getHttpRequest(StringBuilder headStr, StringBuilder pramsStr) throws IOException {
        while (true){
            String line = bufferedReader.readLine();
            if (line == null){
                break;
            }
            //"".equals(line)表示http头信息读取完成，判断是否包含参数
            if ("".equals(line)) {
                //添加换行符
                headStr.append(Constant.Line_Separator);
                //读取post请求json参数
                while ((line = bufferedReader.readLine()) != null) {
                    headStr.append(line);
                    headStr.append(Constant.Line_Separator);
                    pramsStr.append(line);
                    pramsStr.append(Constant.Line_Separator);
                }
                break;
            } else {
                //读取请求体头
                headStr.append(line);
                headStr.append(Constant.Line_Separator);
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
