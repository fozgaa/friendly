document.addEventListener("DOMContentLoaded", () => {
    const activitiesContainer = document.getElementById("activities-container");
    const filterTagsInput = document.getElementById("filter-tags");
    const sortOptions = document.getElementById("sort-options");

    // Default images if no image is provided in JSON
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

    fetch("/data/activities.json")
        .then(response => response.json())
        .then(data => {
            let activities = data; // Store original activities

            // Function to display activities based on the filtered data
            function displayActivities(filteredActivities) {
                activitiesContainer.innerHTML = ""; // Clear any existing content
                filteredActivities.forEach(activity => {
                    const card = document.createElement("div");
                    card.className = "col-md-4 mb-4"; // Add margin-bottom for spacing
                    card.setAttribute("data-tags", activity.tags.join(",").toLowerCase()); // Store tags for filtering

                    // Create an anchor to link to the activity details page
                    const cardLink = document.createElement("a");
                    cardLink.href = `activity.html?id=${encodeURIComponent(activity.title)}`;
                    cardLink.className = "text-decoration-none";

                    // Select image for activity (use a default if not specified)
                    const activityImage = activity.image || defaultImages[Math.floor(Math.random() * defaultImages.length)];

                    // Create the activity card with image
                    cardLink.innerHTML = `
                        <div class="card activity-card">
                            <img src="${activityImage}" class="card-img-top" alt="${activity.title}">
                            <div class="card-body">
                                <h5 class="card-title">${activity.title}</h5>
                                <p><strong>Location:</strong> ${activity.location}</p>
                                <p><strong>Date:</strong> ${activity.date}</p>
                            </div>
                        </div>`;

                    card.appendChild(cardLink);
                    activitiesContainer.appendChild(card);
                });
            }

            // Function to sort activities by date
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

            // Initial display of all activities
            displayActivities(activities);

            // Filter activities based on input
            filterTagsInput.addEventListener("input", (event) => {
                const filterValue = event.target.value.toLowerCase();
                const filteredActivities = activities.filter(activity => {
                    return activity.tags.some(tag => tag.toLowerCase().includes(filterValue));
                });

                const sortedActivities = sortActivities(filteredActivities, sortOptions.value);
                displayActivities(sortedActivities);
            });

            // Sort activities based on selected option
            sortOptions.addEventListener("change", () => {
                const sortedActivities = sortActivities(activities, sortOptions.value);
                displayActivities(sortedActivities);
            });
        })
        .catch(error => {
            console.error("Error loading activities:", error);
            activitiesContainer.innerHTML = "<p>Failed to load activities.</p>";
        });
});
