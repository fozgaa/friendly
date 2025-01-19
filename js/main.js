document.addEventListener("DOMContentLoaded", () => {
    const activitiesContainer = document.getElementById("activities-container");
    const filterTagsInput = document.getElementById("filter-tags");

    const defaultImages = [
        "assets/default-images/default1.jpg",
        "assets/default-images/default2.jpg",
        "assets/default-images/default3.jpg",
        "assets/default-images/default4.jpg",
        "assets/default-images/default5.jpg",
        "assets/default-images/default6.jpg",
        "assets/default-images/default7.jpg",
        "assets/default-images/default8.jpg",
        "assets/default-images/default9.jpg"
    ];

    fetch("data/activities.json")
        .then(response => response.json())
        .then(data => {
            let activities = data;

            function displayActivities(filteredActivities) {
                activitiesContainer.innerHTML = "";
                filteredActivities.forEach(activity => {
                    const card = document.createElement("div");
                    card.className = "col-md-4 mb-4";
                    card.setAttribute("data-tags", activity.tags.join(",").toLowerCase());

                    const cardLink = document.createElement("a");
                    cardLink.href = `../pages/activity.html?id=${encodeURIComponent(activity.id)}`;

                    cardLink.style.textDecoration = 'none';
                    cardLink.style.color = 'inherit';

                    const hash = (str) => {
                        let hashValue = 0;
                        for (let i = 0; i < str.length; i++) {
                            hashValue = (hashValue << 5) - hashValue + str.charCodeAt(i);
                        }
                        return Math.abs(hashValue);
                    };
            
                    const seed = hash(activity.title);
                    const activityImage = activity.image || defaultImages[seed % defaultImages.length];
            
                    cardLink.innerHTML = `
                        <div class="card activity-card shadow-sm border-0">
                            <img src="${activityImage}" class="card-img-top rounded-top" alt="${activity.title}">
                            <div class="card-body p-4">
                                <h5 class="card-title text-dark mb-3">${activity.title}</h5>
                                <p class="card-text text-muted mb-2"><strong>Location:</strong> ${activity.location}</p>
                                <p class="card-text text-muted mb-0"><strong>Date:</strong> ${activity.date}</p>
                            </div>
                        </div>`;
            
                    card.appendChild(cardLink);
                    activitiesContainer.appendChild(card);
                });
            }            

            function sortActivities(filteredActivities, sortOption) {
                return filteredActivities.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);

                    if (sortOption === "date-asc") {
                        return dateA - dateB;
                    } else if (sortOption === "date-desc") {
                        return dateB - dateA;
                    }
                    return 0;
                });
            }

            displayActivities(activities);

            filterTagsInput.addEventListener("input", (event) => {
                const filterValue = event.target.value.toLowerCase();
                const filteredActivities = activities.filter(activity => {
                    return activity.tags.some(tag => tag.toLowerCase().includes(filterValue));
                });

                const sortedActivities = sortActivities(filteredActivities, "date-asc");
                displayActivities(sortedActivities);
            });

            document.getElementById("sort-asc").addEventListener("click", () => {
                const sortedActivities = sortActivities(activities, "date-asc");
                displayActivities(sortedActivities);
            });

            document.getElementById("sort-desc").addEventListener("click", () => {
                const sortedActivities = sortActivities(activities, "date-desc");
                displayActivities(sortedActivities);
            });
        })
        .catch(error => {
            console.error("Error loading activities:", error);
            activitiesContainer.innerHTML = "<p>Failed to load activities.</p>";
        });
});
