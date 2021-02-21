function editUser(guid){
    window.location = `/edituser?userid=${guid}`

}
function deleteUser(guid) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            window.location.reload();
        }
    };
    xhttp.open("POST", "/deleteUser", true);
    xhttp.setRequestHeader("userId", guid);
    xhttp.send();
}
function sortNameAsc(){
    window.location = "/sortNameAsc";
}
function sortNameDes(){
    window.location = "/sortNameDes";
}
