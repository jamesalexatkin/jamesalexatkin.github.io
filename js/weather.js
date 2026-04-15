// Remove hour cards for hours that have already passed.
// Cards labelled "Now" or with a time >= the current hour are kept.
(function () {
    const currentHour = new Date().getHours();
    document
        .querySelectorAll(".hourly-strip .hour-card")
        .forEach(function (card) {
            const label = card.querySelector(".hour-time").textContent.trim();
            if (label === "Now") return;
            const cardHour = parseInt(label.split(":")[0], 10);
            if (cardHour < currentHour) {
                card.remove();
            }
        });
})();
