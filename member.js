function skillsMember() {
    var member = document.getElementById("member");
    var skills = document.getElementById("skills");
    var memberClass = member.getAttribute("class");
    var skillsClass = skills.getAttribute("class");
    if (memberClass == "member") {
        member.setAttribute("class", "member active");
        skills.setAttribute("class", "skills");
    } else {
        member.setAttribute("class", "member");
        skills.setAttribute("class", "skills active");
    }
}