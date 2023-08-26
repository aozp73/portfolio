let modeCnt = 0
window.addEventListener('scroll', function() {
    let navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) { 
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 편집 모드 (toggle)
function toggleEditMode() {
    modeCnt += 1
    if (modeCnt >= 2) {
        location.reload();
    }

    const controls = document.querySelectorAll('.edit-controls');
    controls.forEach(control => {
        if (control.style.display === 'none') {
            control.style.display = 'block';
        } else {
            control.style.display = 'none';
        }
    });
}

function updateForm(event, container_number, postIndex) {

    event.preventDefault();
    let postTitle = $("#postTitle-" + container_number).text();
    let postContent = $("#postContent-" + container_number).html();
    let postImageSrc = $("#postImage-" + container_number).attr('src');


    let section = document.getElementById('content-' + container_number);
        if (postIndex % 2 !== 0) {
            section.innerHTML = `
                <div class="row">
                    <div class="col-1">
                    </div>
                    <div class="col-5 pt-3">
                        <div class="mb-3">
                            <input type="text" class="form-control" id="postTitle-${container_number}" placeholder="제목을 입력하세요" value="${postTitle}">
                        </div>
                        <hr>
                        <div class="mb-3">
                            <textarea class="form-control" id="postContent-${container_number}" rows="5" placeholder="내용을 입력하세요">${postContent}</textarea>
                        </div>
                    </div>
                    <div class="ms-5 col-5">
                        <div class="mb-2">
                            <img src="${postImageSrc}" alt="Description of Image" class="img-fluid responsive-image" id="imageToChange-${container_number}">
                        </div>
                        <input type="file" id="fileInput-${container_number}" onchange="checkImage(${container_number})">
                    </div>
                </div>
                <div class="edit-controls" style="display: none;">
                    <div class="my-3 me-1 d-flex justify-content-end">
                        <a href="#" class="btn btn-outline-secondary me-2">수정하기</a>
                        <a href="#" class="btn btn-outline-danger me-5">삭제하기</a>
                    </div>
                </div>
                <div class="my-3 d-flex justify-content-end">  
                    <button class="btn btn-outline-secondary" onclick="updateImage(${container_number})">수정완료</button>
                </div>
            `;

        } else {
            
            section.innerHTML = `
                <div class="row">
                    <div class="col-5 me-5">
                        <div class="mb-2">
                            <img src="${postImageSrc}" alt="Description of Image" class="img-fluid responsive-image" id="imageToChange-${container_number}">
                        </div>
                        <input type="file" id="fileInput-${container_number}" onchange="checkImage(${container_number})">
                    </div>
                    <div class="col-5 pt-3">
                        <div class="mb-3">
                            <input type="text" class="form-control" id="postTitle-${container_number}" placeholder="제목을 입력하세요" value="${postTitle}">
                        </div>
                        <hr>
                        <div class="mb-3">
                            <textarea class="form-control" id="postContent-${container_number}" rows="5" placeholder="내용을 입력하세요">${postContent}</textarea>
                        </div>
                    </div>
                    <div class="col-2">
                    </div>
                </div>
                <div class="my-3 me-5 d-flex justify-content-end">  
                    <button class="btn btn-outline-secondary" onclick="updateImage(${container_number})">수정완료</button>
                </div>
            `;
        }                
}

function deletePost(container_number) {


}

function addPost() {
    const jwtToken = localStorage.getItem('jwtToken'); 

    let input = document.getElementById('fileInput-new');
    let file = input.files[0];
    if (!file) {
        alert("파일이 선택되지 않았습니다.");
        return;
    }

    let postTitle = $('#postTitle-new').val();
    let postContent = $('#postContent-new').val();
    postContent = postContent.replace(/\n/g, "<br>");

    readFileAsDataURL(input, function(dataURL) {
        let payload = {
            postTitle: postTitle,
            postContent: postContent,
            imageName: file.name,
            contentType: file.type,
            imageData: JSON.stringify(dataURL)
        };
        let imageData = JSON.stringify(dataURL);
        console.log("Encoded image data:", imageData);
        $.ajax({
            url: '/auth/main',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                'Authorization': jwtToken 
            },
            data: JSON.stringify(payload),  

            success: function(response, textStatus, jqXHR) {
                console.log(response);
                appendNewPost(response.data);
            },
            error: function(error) {
                console.error(error);
            }
        });
    });
}  

function appendNewPost(postDTO) {
    const index = document.querySelectorAll('.post-container').length;
    let newPostHTML = "";
    if (index % 2 === 0) {
        newPostHTML = `
        <div class="container post-container ps-5" style="height:450px" id="content-${postDTO.id}">
            <div class="row">
            <div class="col-5 me-5">
                <img src="${postDTO.imgURL}" alt="Description of Image" class="img-fluid responsive-image">
            </div>
            <div class="col-5 pt-3">
                <h2>${postDTO.postTitle}</h2><hr>
                ${postDTO.postContent}
            </div>
            <div class="col-2"></div>
            </div>
            <div class="edit-controls" style="display: none;">
            <div class="my-3 me-5 d-flex justify-content-end">
                <button type="button" class="btn btn-outline-secondary me-2" onclick="updateForm(event, ${postDTO.id}, ${index + 1}})">수정하기</button>
                <button type="button" class="btn btn-outline-danger me-5" onclick="deletePost(${postDTO.id})">삭제하기</button>
            </div>
            </div>
        </div>`;
    } else {
        // Use the second template
        newPostHTML = `
        <div class="container post-container pe-5" style="height:450px" id="content-${postDTO.id}">
            <div class="row">
            <div class="col-1"></div>
            <div class="col-5 pt-3">
                <h2>${postDTO.postTitle}</h2><hr>
                ${postDTO.postContent}
            </div>
            <div class="col-5 ms-5">
                <img src="${postDTO.imgURL}" alt="Description of Image" class="img-fluid responsive-image">
            </div>
            </div>
            <div class="edit-controls" style="display: none;">
            <div class="my-3 me-1 d-flex justify-content-end">
                <button type="button" class="btn btn-outline-secondary me-2" onclick="updateForm(event, ${postDTO.id}, ${index + 1}})">수정하기</button>
                <button type="button" class="btn btn-outline-danger me-5" onclick="deletePost(${postDTO.id})">삭제하기</button>
            </div>
            </div>
        </div>`;
    }

    $("#postBox").append(newPostHTML);
    const controls = document.querySelectorAll('.edit-controls');
    controls.forEach(control => {
        if (control.style.display === 'none') {
            control.style.display = 'block';
        } 
    });

    resetForm();
}

function resetForm() {
    // 제목, 내용 필드 초기화
    $('#postTitle-new').val('');
    $('#postContent-new').val('');
  
    // 파일 입력 및 이미지 미리보기 초기화
    $('#fileInput-new').val('');
    $('#imagePreview').empty();
}

function previewImage(event) {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onloadend = function() {
        const imagePreview = document.querySelector('.blog-image-preview');
        imagePreview.style.backgroundImage = 'url(' + reader.result + ')';
        imagePreview.style.backgroundSize = '100% 100%';
        imagePreview.style.backgroundPosition = 'center center';
        document.querySelector('.plus-icon').style.display = 'none'; // + 모양 숨기기

        imagePreview.classList.remove('blog-image-preview'); // 기존 클래스 제거
        imagePreview.classList.add('blog-image-preview-change'); // 새로운 클래스 추가
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        resetPreview();
    }
}

function checkImage(container_number) {
    const fileInput = document.getElementById('fileInput-'+container_number);
    const imageToChange = document.getElementById('imageToChange-'+container_number);
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        // 이벤트 큐에 등록. CallBack 함수 작성
        reader.onload = function(e) {
            imageToChange.src = e.target.result;
        }
        // 다 읽고 난 뒤, 위 CallBack 함수 작동
        reader.readAsDataURL(file);
    }
}

function updateImage(container_number){
    postPK = `${container_number}`
    postTitle = $(`#postTitle-${container_number}`).val()
    postContent = $(`#postContent-${container_number}`).val()

    let input = document.getElementById(`fileInput-${container_number}`);

    readFileAsDataURL(input, function(dataURL) {
        let imgData = {
            "image": dataURL
        };
        let jsonPayload = JSON.stringify(imgData);
    });

    // ajax 통신 이 후, reload
}

function readFileAsDataURL(input, callback) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            callback(e.target.result);
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}