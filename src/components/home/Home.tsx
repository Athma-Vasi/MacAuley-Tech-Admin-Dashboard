import { COLORS_SWATCHES } from "../../constants";
import { useGlobalState } from "../../hooks/useGlobalState";
import { returnThemeColors } from "../../utils";
import DashboardWrapper from "../dashboard";
import Header from "../header";
import Sidebar from "../sidebar";

function Home() {
    const {
        globalState: { themeObject },
    } = useGlobalState();

    const { backgroundColor, textColor } = returnThemeColors({
        colorsSwatches: COLORS_SWATCHES,
        themeObject,
    });

    return (
        <div className="app" style={{ backgroundColor, color: textColor }}>
            <Header />
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="main">
                <h2>Main content</h2>
                <DashboardWrapper />
            </div>
        </div>
    );
}

export default Home;
