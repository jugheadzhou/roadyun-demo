package com.roadyun.example.client;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

/**
 * @Author: zhaorong@roadyun.com.cn
 * @Description:
 * @Date:Create：in 2020/5/26 0026 10:49
 * @Modified By：
 */
public class SocketClient {
    Socket socket = null;

    public void createSocket() {
        try {
            socket = new Socket("localhost", 8888);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void communcate() {
        // 注意这里必须制定请求方式 地址 注意空格
        StringBuffer sb = new StringBuffer("GET http://localhost/ HTTP/1.1\r\n");
        // 以下为请求头
        sb.append("Host: localhost\r\n");
        sb.append("User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0\r\n");
        sb.append("Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n");
        sb.append("Accept-Language: zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3");
        // 注意这里不要使用压缩 否则返回乱码
        sb.append("Accept-Encoding: \r\n");
        sb.append("Connection: keep-alive\r\n");
        sb.append("Upgrade-Insecure-Requests: 1\r\n");
        // 注意这里要换行结束请求头
        sb.append("\r\n");
        System.out.println("请求头："+sb.toString());
        try {
            OutputStream os = socket.getOutputStream();
            os.write(sb.toString().getBytes());

            InputStream is = socket.getInputStream();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] bytes = new byte[1024];
            int len = -1;
            while ((len = is.read(bytes)) != -1) {
                baos.write(bytes, 0, len);
            }
            System.out.println(new String(baos.toByteArray()));
            socket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        SocketClient client = new SocketClient();
        client.createSocket();
        client.communcate();
    }
}
