document.addEventListener("DOMContentLoaded", () => {
    const activitiesContainer = document.getElementById("activities-container");

    fetch("activities.json")
        .then(response => response.json())
        .then(data => {
            activitiesContainer.innerHTML = ""; // Clear any existing content
            data.forEach(activity => {
                const card = document.createElement("div");
                card.className = "col-md-4 mb-4"; // Add margin-bottom for spacing
                card.innerHTML = `
                    <div class="card activity-card">
                        <div class="card-body">
                            <h5 class="card-title">${activity.title}</h5>
                            <p class="card-text">${activity.description}</p>
                            <p><strong>Location:</strong> ${activity.location}</p>
                            <p><strong>Date:</strong> ${activity.date}</p>
                        </div>
                    </div>`;
                activitiesContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error loading activities:", error);
            activitiesContainer.innerHTML = "<p>Failed to load activities.</p>";
        });
});
