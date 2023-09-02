package com.portfolio.portfolio_project.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.portfolio.portfolio_project.core.util.s3_utils.S3Utils;
import com.portfolio.portfolio_project.domain.jpa.myblog.my_blog.MyBlog;
import com.portfolio.portfolio_project.domain.jpa.myblog.my_blog.MyBlogRepository;
import com.portfolio.portfolio_project.web.blog.MyBlogDTO_In;
import com.portfolio.portfolio_project.web.blog.MyBlogDTO_Out;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MyBlogService {
    
    private final MyBlogRepository myBlogRepository;
    private final S3Utils s3Utils;

    // FindAll
    @Transactional(readOnly = true)
    public List<MyBlogDTO_Out.FindAllDTO> myBlog_findAll(){
        List<MyBlog> myBlogsPS = myBlogRepository.findAll();
        
        return MyBlogDTO_Out.FindAllDTO.fromEntityList(myBlogsPS);
    }


    // POST
    @Transactional
    public MyBlogDTO_Out.PostDTO myBlog_post(MyBlogDTO_In.postDTO postDTO_In){
        List<String> blogImg_nameAndUrl = s3Utils.uploadImageToS3(postDTO_In.getImageData(), 
                                postDTO_In.getImageName(), 
                                postDTO_In.getContentType(),
                                "my_blog");

        MyBlog myBlog = postDTO_In.toEntity();
        myBlog.setBlogImgName(blogImg_nameAndUrl.get(0));
        myBlog.setBlogImgUrl(blogImg_nameAndUrl.get(1));  

        myBlogRepository.save(myBlog);
        
        return MyBlogDTO_Out.PostDTO.fromEntity(myBlog);
    }

}
