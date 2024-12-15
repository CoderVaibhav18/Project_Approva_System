
function showDescription(title, description) {
  document.getElementById("modal-title").innerText = title;
  document.getElementById("modal-description").innerText = description;
  document.getElementById("description-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("description-modal").style.display = "none";
}

async function updateStatus(projectId, status) {
  try {
    const response = await fetch(`/api/projects/${projectId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();

    if (response.ok) {
      alert(
        `Project ${status.charAt(0).toUpperCase() + status.slice(1)}!`
      );
      location.reload(); // Refresh the page to update the table
    } else {
      alert(`Failed to update project status: ${result.message}`);
    }
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Something went wrong. Please try again.");
  }
}
