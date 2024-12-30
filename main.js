document.addEventListener("DOMContentLoaded", () => {
    const activitiesContainer = document.getElementById("activities-container");
    const filterTagsInput = document.getElementById("filter-tags");
    const sortOptions = document.getElementById("sort-options");

    fetch("activities.json")
        .then((response) => response.json())
        .then((data) => {
            const currentDate = new Date();
            let activities = data.filter(activity => new Date(activity.date) >= currentDate);

            function renderActivities() {
                activitiesContainer.innerHTML = "";
                activities.forEach(activity => {
                    const card = document.createElement("div");
                    card.className = "col-md-4";
                    card.innerHTML = `
                        <div class="card activity-card">
                            <img src="${activity.image}" class="card-img-top" alt="${activity.title}">
                            <div class="card-body">
                                <h5 class="card-title">${activity.title}</h5>
                                <p class="card-text">${activity.description}</p>
                                <p><strong>Location:</strong> ${activity.location}</p>
                                <p><strong>Date:</strong> ${activity.date}</p>
                                <a href="#" class="btn btn-primary" onclick="alert('More info about ${activity.title}')">More Info</a>
                            </div>
                        </div>`;
                    activitiesContainer.appendChild(card);
                });
            }

            function filterAndSortActivities() {
                const tagFilter = filterTagsInput.value.toLowerCase();
                activities = data
                    .filter(activity => new Date(activity.date) >= currentDate)
                    .filter(activity => activity.tags.some(tag => tag.toLowerCase().includes(tagFilter)))
                    .sort((a, b) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);
                        return sortOptions.value === "date-asc" ? dateA - dateB : dateB - dateA;
                    });
                renderActivities();
            }

            filterTagsInput.addEventListener("input", filterAndSortActivities);
            sortOptions.addEventListener("change", filterAndSortActivities);
            renderActivities();
        });
});
