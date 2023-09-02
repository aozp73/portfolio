package com.portfolio.portfolio_project.web.blog;

import java.util.ArrayList;
import java.util.List;

import com.portfolio.portfolio_project.domain.jpa.myblog.my_blog.MyBlog;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class MyBlogDTO_Out {
    
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FindAllDTO {
        private Long id;
        private String postTitle;
        private String postSubTitle;
        private String postContent;
        private String imgURL;

        public static FindAllDTO fromEntity(MyBlog entity) {
            return new FindAllDTO(entity.getId(), entity.getMainTitle(), entity.getSubTitle(), entity.getContent(), entity.getBlogImgUrl());
        }

        public static List<FindAllDTO> fromEntityList(List<MyBlog> entityList) {
            List<FindAllDTO> dtoList = new ArrayList<>();
            for (MyBlog entity : entityList) {
                dtoList.add(FindAllDTO.fromEntity(entity));
            }
             return dtoList;
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PostDTO {
        private Long id;
        private String postTitle;
        private String postSubTitle;
        private String postContent;
        private String imgURL;

        public static PostDTO fromEntity(MyBlog entity) {
            return new PostDTO(entity.getId(), entity.getMainTitle(), entity.getSubTitle(), entity.getContent(), entity.getBlogImgUrl());
        }
    }
}
