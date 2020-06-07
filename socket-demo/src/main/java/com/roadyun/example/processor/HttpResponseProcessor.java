package com.roadyun.example.processor;

import com.roadyun.example.common.Constant;
import com.roadyun.example.common.SystemUtils;

import java.io.*;
import java.net.Socket;
import java.net.URL;
import java.util.List;
import java.util.UUID;

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

    /**
     * 响应HTML/txt
     * @param filePath
     */
    public void writeFile(String filePath){
        printWriter.println("HTTP/1.1 200 OK");
        printWriter.println("Content-Type: text/html;charset=utf-8 ");
        printWriter.println();
        printWriter.println(getResourcesStr(filePath));
        printWriter.flush();
    }

    /**
     * 响应Img
     * @param filePath
     */
    public void writeImg(String filePath){
        printWriter.println("HTTP/1.1 200 OK");
        printWriter.println("Content-Type: text/html;charset=utf-8 ");
        printWriter.println();
        printWriter.println(getResourcesStr(filePath));
        printWriter.flush();
    }

    /**
     * 获取指定文件内容
     * @param filePath
     * @return
     */
    private String getResourcesStr(String filePath){
        File file = SystemUtils.getResourcesDir(filePath);
        String httpRequestStr = "no content";
        try {
            FileInputStream fileInputStream = new FileInputStream(file);
            int available = fileInputStream.available();
            if (available == 0) {
                return httpRequestStr;
            }
            byte[] httpRequestBytes = new byte[available];
            int read = fileInputStream.read(httpRequestBytes);
            httpRequestStr = new String(httpRequestBytes, 0, read);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return httpRequestStr;
    }

    /**
     *
     * @see java Socket 模拟 http上传文件
     *
     */
    public void upload(String filePath) throws Exception {
        String BOUNDARY = UUID.randomUUID().toString();
        String fileName = filePath.substring(filePath.lastIndexOf("/")+1);
        File resourcesFile = SystemUtils.getResourcesDir(filePath);
        // 表单字段和文件的数据
        StringBuilder sb = new StringBuilder();
        sb.append("\r\n\r\n--" + BOUNDARY + "\r\n");
        sb.append("Content-Disposition: form-data; name=\"name\"" + "\r\n");
        sb.append("\r\n");
        sb.append("name" + "\r\n");

        // 文件之前的数据
        byte[] before = sb.toString().getBytes("UTF-8");
        // 文件之后的数据
        byte[] after = ("--" + BOUNDARY + "--\r\n").getBytes("UTF-8");
        sb = new StringBuilder();
        sb.append("--" + BOUNDARY + "\r\n");
        sb.append("Content-Disposition: form-data; name=\"file\"; filename=\"" + fileName + "\"" + "\r\n");
        sb.append("Content-Type: image/pjpeg" + "\r\n");
        sb.append("\r\n");

        int blen = sb.toString().getBytes("UTF-8").length;
        //请求头
        StringBuffer header = new StringBuffer();
        header.append("HTTP/1.1 200 OK");
        header.append("Accept: */*\r\n");
        header.append("Accept-Language: zh-cn\r\n");
        header.append("Accept-Charset: utf-8\r\n");
        header.append("Content-Type: multipart/form-data; boundary=" + BOUNDARY + "\r\n");
        header.append("Content-Length: " + String.valueOf(before.length + blen + resourcesFile.length() + after.length)+ "\r\n");
        header.append("\r\n");
        header.append("--" + BOUNDARY + "\r\n");
        header.append("Content-Disposition: form-data; name=\"file\"; filename=\"" + fileName + "\"" + "\r\n");
        header.append("Content-Type: image/jpg" + "\r\n");
        header.append("\r\n");
        header.append(getResourcesStr(filePath));
        printWriter.print(header);

    }
}
