package com.roadyun.example.processor;

import com.roadyun.example.common.Constant;
import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * @ClassName: HttpRequestProcessor
 * @Description: 将http请求体封装成map
 * @Author 2181250231@qq.com
 * @Create 2020/6/221:41
 */
public class HttpRequestProcessor {

    private Map<String, String> httpRequest = new HashMap<>(16);

    public Map<String, String> getHttpRequest() {
        return httpRequest;
    }

    public HttpRequestProcessor(InputStream inputStream) throws IOException, InterruptedException {
        /**
         * 读取请求体
         * 因为网络通讯往往是间断性的，一串字节往往分几批进行发送。
         * 例如对方发来字节长度100的数据，本地程序调用available()方法有时得到0，有时得到90，有时能得到100，大多数情况下是100。
         * 这可能是对方还没有响应，也可能是对方已经响应了，但是数据还没有送达本地。也许分3批到达，也许分两批，也许一次性到达。
         */
        // 方案一、指定接收大小
        //        String httpRequestStr = "";
        //        byte[] httpRequestBytes = new byte[1024];
        //        int length = 0;
        //        if ((length = inputStream.read(httpRequestBytes)) > 0) {
        //            httpRequestStr = new String(httpRequestBytes, 0, length);
        //        }
        // 方案二、获取报文传输参数Content-length的长度,针对开发中已经请求体对象的情况
        // 方案三、延迟0.2秒
        Thread.sleep(200);
        String httpRequestStr = "";
        int available = inputStream.available();
        if (available == 0) {
            return;
        }
        byte[] httpRequestBytes = new byte[available];
        int read = inputStream.read(httpRequestBytes);
        httpRequestStr = new String(httpRequestBytes, 0, read);
        System.out.println("---------------HTTP请求体------------");
        System.out.println(httpRequestStr);
        // 将请求体按空白分隔符分成数组
        String[] headArray = httpRequestStr.split(Constant.Line_Separator);
        // 处理第一行
        String firstLine = headArray[0];
        if (StringUtils.isNotEmpty(firstLine)) {
            System.out.println("firstLine: " + firstLine);
            if (firstLine.contains("/favicon.ico")) {
                return;
            }
            // 解析请求体
            this.parseHeaders(headArray);
        }
    }

    /**
     * 解析请求体
     * <p>
     * TODO 可按照Content-type 判断解析什么类型的参数
     *
     * @param headArray
     */
    public void parseHeaders(String[] headArray) {
        int headLength = headArray.length;

        // 1. 解析第一行
        String firstLine = headArray[0];
        String[] firstLineArray = firstLine.split(Constant.Blank_Separator);
        httpRequest.put(Constant.Method, firstLineArray[0]);
        String url = firstLineArray[1];
        httpRequest.put(Constant.URL, url);

        // 2. 解析url参数
        if (url.contains(Constant.Question_Separator)) {
            String[] split = url.split(Constant.Question_Separator);
            httpRequest.put(Constant.Parameter, split[1]);
        }

        // 3. 解析body参数（最后两行）
        String lastLine = headArray[headLength - 1];
        // 3.1 如果最后一行是空白符
        if (Constant.SPACE.equals(lastLine)) {
            headLength = headLength - 1;
            // 3.2 如果最后一行是不为空，且倒数第二行是空白符，表示最后一行是参数
        } else if (Constant.SPACE.equals(headArray[headLength - 2]) && StringUtils.isNotEmpty(lastLine)) {
            httpRequest.put(Constant.Parameter, lastLine);
            headLength = headLength - 2;
        }

        // 4. 读取请求头字段
        for (int i = 1; i < headLength; i++) {
            String line = headArray[i];
            httpRequest.put(line.substring(Constant.ZERO, line.indexOf(Constant.COLON)),
                    line.substring(line.indexOf(Constant.COLON) + Constant.TWO));
        }
    }
}
