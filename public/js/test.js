function submitContents(option) {
    var title = document.getElementById('addConentSubject');
    var content = document.getElementById('addContents');
    var writer = document.getElementById('addContentWriter');
    if(option == 'add') {
        // 새 글 등록 시
        if(title == '' || content == '' || writer == '') {
            alert("제목과 내용, 작성자 모두 있어야합니다.");
            return;
        } else {
            location.href='/submit';
        }
    }
}