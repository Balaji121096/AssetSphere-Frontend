function DashboardCards() {

    const cards = [
        { title: "Total Assets", value: 120 },
        { title: "Assigned", value: 82 },
        { title: "In Stock", value: 28 },
        { title: "Repair", value: 5 },
        { title: "Scrap", value: 3 },
        { title: "Employees", value: 80 }
    ];

    return (

        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                marginTop: "20px"
            }}
        >

            {cards.map((card, index) => (

                <div
                    key={index}
                    style={{
                        background: "#ffffff",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.15)"
                    }}
                >

                    <h3>{card.title}</h3>

                    <h1>{card.value}</h1>

                </div>

            ))}

        </div>

    );

}

export default DashboardCards;