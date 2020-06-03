package com.roadyun.example.processor;

import java.io.PrintWriter;

/**
 * @ClassName: HttpRequestProcessor
 * @Description: 将http请求体封装成map
 * @Author 2181250231@qq.com
 * @Create 2020/6/221:41
 */
public class HttpResponseProcessor {

    private PrintWriter printWriter;

    public HttpResponseProcessor(PrintWriter printWriter) {
        this.printWriter = printWriter;
    }

    /**
     * 响应字符串
     * @param content
     */
    public void write(String content) {
        printWriter.println("HTTP/1.1 200 OK");
        printWriter.println("Content-Type: text/html;charset=utf-8 ");
        printWriter.println();
        printWriter.println("<html><body><b>");
        printWriter.println(content);
        printWriter.println("</b></body></html>");
        printWriter.flush();
    }
}
