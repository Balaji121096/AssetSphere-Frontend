import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
    useTheme
} from "../context/ThemeContext";


function Theme() {

    const navigate =
        useNavigate();

    const {
        theme,
        selectTheme,
        applyCustomTheme,
        resetTheme,
        suggestedThemes
    } = useTheme();


    const [customPrimary, setCustomPrimary] =
        useState(theme.primary);

    const [customBackground, setCustomBackground] =
        useState(theme.background);

    const [message, setMessage] =
        useState("");


    // =================================================
    // SELECT SUGGESTED
    // =================================================

    const handleThemeSelect = (newTheme) => {

        selectTheme(newTheme);

        setCustomPrimary(
            newTheme.primary
        );

        setCustomBackground(
            newTheme.background
        );

        setMessage(
            `${newTheme.name} applied to entire application`
        );

    };


    // =================================================
    // CUSTOM
    // =================================================

    const handleApplyCustom = () => {

        applyCustomTheme({

            primary:
                customPrimary,

            background:
                customBackground

        });

        setMessage(
            "Custom theme applied to entire application"
        );

    };


    // =================================================
    // RESET
    // =================================================

    const handleReset = () => {

        resetTheme();

        setCustomPrimary(
            "#2563eb"
        );

        setCustomBackground(
            "#f8fafc"
        );

        setMessage(
            "Default theme restored"
        );

    };


    return (

        <div
            className="theme-page"
            style={{
                background:
                    "var(--app-background)",

                color:
                    "var(--text-color)"
            }}
        >

            <Sidebar />


            <div className="theme-main">

                <Navbar />


                <main className="theme-content">


                    {/* =========================================
                        HERO
                    ========================================= */}

                    <section
                        className="theme-hero"
                        style={{
                            background:
                                `linear-gradient(
                                    135deg,
                                    ${theme.sidebar},
                                    ${theme.primary}
                                )`
                        }}
                    >

                        <div>

                            <div className="theme-eyebrow">
                                ASSETSPHERE • APPEARANCE
                            </div>

                            <h1>
                                Theme & Appearance
                            </h1>

                            <p>
                                Choose a theme and apply it
                                across the entire AssetSphere application.
                            </p>

                        </div>

                        <div className="theme-hero-icon">
                            🎨
                        </div>

                    </section>


                    {/* =========================================
                        BACK
                    ========================================= */}

                    <button
                        className="theme-back"
                        onClick={() =>
                            navigate("/settings")
                        }
                    >
                        ← Back to Settings
                    </button>


                    {/* =========================================
                        MESSAGE
                    ========================================= */}

                    {message && (

                        <div className="theme-message">

                            ✓ {message}

                        </div>

                    )}


                    {/* =========================================
                        SUGGESTED THEMES
                    ========================================= */}

                    <section className="theme-section">

                        <div className="theme-section-heading">

                            <div>

                                <h2>
                                    Suggested Themes
                                </h2>

                                <p>
                                    Select a theme to change the
                                    entire AssetSphere interface.
                                </p>

                            </div>

                        </div>


                        <div className="theme-grid">

                            {suggestedThemes.map(
                                (item) => (

                                    <ThemeCard
                                        key={item.name}
                                        theme={item}
                                        selected={
                                            theme.name ===
                                            item.name
                                        }
                                        onSelect={
                                            handleThemeSelect
                                        }
                                    />

                                )
                            )}

                        </div>

                    </section>


                    {/* =========================================
                        CUSTOM THEME
                    ========================================= */}

                    <section className="custom-theme-section">

                        <div className="custom-header">

                            <div>

                                <div
                                    className="custom-eyebrow"
                                    style={{
                                        color:
                                            theme.primary
                                    }}
                                >
                                    CUSTOMIZE
                                </div>

                                <h2>
                                    Custom Theme
                                </h2>

                                <p>
                                    Create your own theme colors
                                    for the complete application.
                                </p>

                            </div>

                            <div
                                className="custom-icon"
                                style={{
                                    color:
                                        theme.primary
                                }}
                            >
                                ✨
                            </div>

                        </div>


                        {/* =====================================
                            COLOR CONTROLS
                        ===================================== */}

                        <div className="custom-controls">


                            <div className="color-control">

                                <label>
                                    Primary Color
                                </label>

                                <div className="color-row">

                                    <input
                                        type="color"
                                        value={
                                            customPrimary
                                        }
                                        onChange={(e) =>
                                            setCustomPrimary(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <input
                                        type="text"
                                        value={
                                            customPrimary
                                        }
                                        onChange={(e) =>
                                            setCustomPrimary(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            <div className="color-control">

                                <label>
                                    Background Color
                                </label>

                                <div className="color-row">

                                    <input
                                        type="color"
                                        value={
                                            customBackground
                                        }
                                        onChange={(e) =>
                                            setCustomBackground(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <input
                                        type="text"
                                        value={
                                            customBackground
                                        }
                                        onChange={(e) =>
                                            setCustomBackground(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>

                        </div>


                        {/* =====================================
                            PREVIEW
                        ===================================== */}

                        <div
                            className="theme-preview"
                            style={{
                                background:
                                    customBackground
                            }}
                        >

                            <div
                                className="preview-sidebar"
                                style={{
                                    background:
                                        theme.sidebar
                                }}
                            >

                                <div
                                    className="preview-logo"
                                    style={{
                                        background:
                                            customPrimary
                                    }}
                                >
                                    A
                                </div>

                                <div />
                                <div />
                                <div />

                            </div>


                            <div className="preview-main">

                                <div
                                    className="preview-navbar"
                                    style={{
                                        background:
                                            theme.card,

                                        borderColor:
                                            theme.border
                                    }}
                                />

                                <div className="preview-cards">

                                    <div
                                        className="preview-card"
                                        style={{
                                            background:
                                                theme.card,

                                            borderColor:
                                                theme.border
                                        }}
                                    />

                                    <div
                                        className="preview-card"
                                        style={{
                                            background:
                                                theme.card,

                                            borderColor:
                                                theme.border
                                        }}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* =====================================
                            BUTTONS
                        ===================================== */}

                        <div className="theme-actions">

                            <button
                                className="primary-button"
                                style={{
                                    background:
                                        customPrimary
                                }}
                                onClick={
                                    handleApplyCustom
                                }
                            >
                                ✓ Apply Custom Theme
                            </button>


                            <button
                                className="secondary-button"
                                onClick={() => {

                                    selectTheme(theme);

                                    setMessage(
                                        "Current theme applied"
                                    );

                                }}
                            >
                                ✓ Apply Theme
                            </button>


                            <button
                                className="reset-button"
                                onClick={
                                    handleReset
                                }
                            >
                                Reset to Default
                            </button>

                        </div>

                    </section>


                    {/* =========================================
                        CURRENT
                    ========================================= */}

                    <section className="current-theme">

                        <div>

                            <div className="current-label">
                                CURRENT THEME
                            </div>

                            <div className="current-name">
                                {theme.name}
                            </div>

                        </div>

                        <div
                            className="current-color"
                            style={{
                                background:
                                    theme.primary
                            }}
                        />

                    </section>

                </main>

            </div>


            {/* =============================================
                PAGE CSS
            ============================================= */}

            <style>
                {`

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    background: var(--app-background);
                    color: var(--text-color);
                    transition:
                        background-color .25s ease,
                        color .25s ease;
                }

                .theme-page {
                    min-height: 100vh;
                    display: flex;
                    background: var(--app-background);
                    color: var(--text-color);
                }

                .theme-main {
                    flex: 1;
                    min-width: 0;
                }

                .theme-content {
                    max-width: 1250px;
                    margin: auto;
                    padding: 32px;
                }

                .theme-hero {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 28px 24px;
                    border-radius: 16px;
                    margin-bottom: 20px;
                    color: white;
                }

                .theme-eyebrow {
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1.3px;
                    margin-bottom: 8px;
                    color: #dbeafe;
                }

                .theme-hero h1 {
                    margin: 0;
                    color: white;
                    font-size: 28px;
                }

                .theme-hero p {
                    margin: 7px 0 0;
                    color: #dbeafe;
                    font-size: 12px;
                }

                .theme-hero-icon {
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    background: rgba(255,255,255,.12);
                    font-size: 23px;
                }

                .theme-back {
                    border: none;
                    background: transparent;
                    color: var(--primary-color);
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 700;
                    margin-bottom: 18px;
                }

                .theme-message {
                    padding: 11px 14px;
                    border-radius: 9px;
                    margin-bottom: 18px;
                    border: 1px solid var(--primary-color);
                    background: var(--card-color);
                    color: var(--primary-color);
                    font-size: 12px;
                    font-weight: 700;
                }

                .theme-section {
                    margin-bottom: 24px;
                }

                .theme-section-heading {
                    margin-bottom: 16px;
                }

                .theme-section-heading h2 {
                    margin: 0;
                    color: var(--text-color);
                    font-size: 18px;
                }

                .theme-section-heading p {
                    margin: 5px 0 0;
                    color: var(--muted-text-color);
                    font-size: 13px;
                }

                .theme-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(4, minmax(0, 1fr));
                    gap: 16px;
                }

                .theme-card {
                    background: var(--card-color);
                    border: 1px solid var(--border-color);
                    border-radius: 14px;
                    padding: 12px;
                    cursor: pointer;
                    transition: .18s ease;
                }

                .theme-card:hover {
                    transform: translateY(-3px);
                    box-shadow:
                        0 10px 25px
                        rgba(15,23,42,.10);
                }

                .custom-theme-section {
                    background: var(--card-color);
                    border: 1px solid var(--border-color);
                    border-radius: 14px;
                    padding: 22px;
                    margin-bottom: 18px;
                }

                .custom-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 22px;
                }

                .custom-eyebrow {
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 1.2px;
                }

                .custom-header h2 {
                    margin: 4px 0 0;
                    color: var(--text-color);
                    font-size: 17px;
                }

                .custom-header p {
                    margin: 5px 0 0;
                    color: var(--muted-text-color);
                    font-size: 12px;
                }

                .custom-icon {
                    font-size: 22px;
                }

                .custom-controls {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 18px;
                    margin-bottom: 20px;
                }

                .color-control {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .color-control label {
                    color: var(--text-color);
                    font-size: 12px;
                    font-weight: 700;
                }

                .color-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .color-row input[type="color"] {
                    width: 48px;
                    height: 40px;
                    padding: 3px;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    cursor: pointer;
                }

                .color-row input[type="text"] {
                    flex: 1;
                    height: 40px;
                    padding: 0 12px;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    outline: none;
                    background: var(--background-color);
                    color: var(--text-color);
                }

                .theme-preview {
                    height: 190px;
                    display: flex;
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 20px;
                }

                .preview-sidebar {
                    width: 24%;
                    padding: 14px;
                }

                .preview-sidebar > div:not(.preview-logo) {
                    height: 6px;
                    background: rgba(255,255,255,.2);
                    border-radius: 5px;
                    margin-bottom: 10px;
                }

                .preview-logo {
                    width: 28px;
                    height: 28px;
                    border-radius: 7px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 800;
                    margin-bottom: 20px;
                }

                .preview-main {
                    flex: 1;
                    padding: 12px;
                }

                .preview-navbar {
                    height: 28px;
                    border: 1px solid;
                    border-radius: 6px;
                    margin-bottom: 12px;
                }

                .preview-cards {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }

                .preview-card {
                    height: 105px;
                    border: 1px solid;
                    border-radius: 7px;
                }

                .theme-actions {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .theme-actions button {
                    padding: 10px 16px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .primary-button {
                    border: none;
                    color: white;
                }

                .secondary-button,
                .reset-button {
                    border: 1px solid var(--border-color);
                    background: var(--app-background);
                    color: var(--text-color);
                }

                .current-theme {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 18px;
                    border: 1px solid var(--border-color);
                    background: var(--card-color);
                    border-radius: 12px;
                }

                .current-label {
                    color: var(--muted-text-color);
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    margin-bottom: 4px;
                }

                .current-name {
                    color: var(--text-color);
                    font-size: 13px;
                    font-weight: 700;
                }

                .current-color {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                }

                @media (max-width: 900px) {

                    .theme-content {
                        padding: 24px;
                    }

                    .theme-grid {
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));
                    }

                }

                @media (max-width: 600px) {

                    .theme-content {
                        padding: 18px;
                    }

                    .theme-grid {
                        grid-template-columns: 1fr;
                    }

                    .custom-controls {
                        grid-template-columns: 1fr;
                    }

                    .theme-hero-icon {
                        display: none;
                    }

                    .theme-actions {
                        flex-direction: column;
                    }

                }

                `}
            </style>

        </div>

    );

}


// =====================================================
// THEME CARD
// =====================================================

function ThemeCard({
    theme,
    selected,
    onSelect
}) {

    return (

        <div
            className="theme-card"
            onClick={() =>
                onSelect(theme)
            }
            style={{
                borderColor:
                    selected
                        ? theme.primary
                        : "var(--border-color)",

                boxShadow:
                    selected
                        ? `0 0 0 2px ${theme.primary}30`
                        : "none"
            }}
        >

            <div
                style={{
                    height: 120,
                    borderRadius: 9,
                    overflow: "hidden",
                    display: "flex",
                    background:
                        theme.background
                }}
            >

                <div
                    style={{
                        width: "29%",
                        background:
                            theme.sidebar,
                        padding: 8
                    }}
                >

                    <div
                        style={{
                            width: 17,
                            height: 17,
                            borderRadius: 5,
                            background:
                                theme.primary,
                            marginBottom: 13
                        }}
                    />

                    <div
                        style={{
                            height: 5,
                            background:
                                "rgba(255,255,255,.22)",
                            borderRadius: 4,
                            marginBottom: 8
                        }}
                    />

                    <div
                        style={{
                            height: 5,
                            background:
                                "rgba(255,255,255,.22)",
                            borderRadius: 4,
                            marginBottom: 8
                        }}
                    />

                </div>


                <div
                    style={{
                        flex: 1,
                        padding: 8
                    }}
                >

                    <div
                        style={{
                            height: 18,
                            borderRadius: 5,
                            background:
                                theme.card,
                            border:
                                `1px solid ${theme.border}`,
                            marginBottom: 10
                        }}
                    />

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap: 7
                        }}
                    >

                        <div
                            style={{
                                height: 65,
                                background:
                                    theme.card,
                                border:
                                    `1px solid ${theme.border}`,
                                borderRadius: 6
                            }}
                        />

                        <div
                            style={{
                                height: 65,
                                background:
                                    theme.card,
                                border:
                                    `1px solid ${theme.border}`,
                                borderRadius: 6
                            }}
                        />

                    </div>

                </div>

            </div>


            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    padding:
                        "12px 3px 3px"
                }}
            >

                <div>

                    <div
                        style={{
                            color:
                                "var(--text-color)",
                            fontSize: 13,
                            fontWeight: 700
                        }}
                    >
                        {theme.name}
                    </div>

                    <div
                        style={{
                            color:
                                "var(--muted-text-color)",
                            fontSize: 10,
                            marginTop: 3
                        }}
                    >
                        {theme.primary}
                    </div>

                </div>


                {selected && (

                    <div
                        style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background:
                                theme.primary,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800
                        }}
                    >
                        ✓
                    </div>

                )}

            </div>

        </div>

    );

}


export default Theme;