let filters = document.querySelectorAll('.filter');
let form = document.getElementById('my-form');
let input = document.createElement("input");

filters.forEach(filter => {
    filter.addEventListener('click', function () {
        // Remove the 'active' class from all filters
        filters.forEach(f => f.classList.remove('active'));
        
        // Add the 'active' class to the clicked filter
        this.classList.add('active');

        input.name = "category";
        input.value = this.children[1].innerText;

        form.appendChild(input);
        form.submit();
    });
});