import { TbSettings } from "react-icons/tb";
import { AccessibleButton } from "../../accessibleInputs/AccessibleButton";
import "./index.css";

function Settings() {
    const dialogModal = (
        <dialog>
            <p>modal dialog</p>
            <AccessibleButton
                attributes={{
                    enabledScreenreaderText: "Open settings",
                    disabledScreenreaderText: "Settings is closed",
                    kind: "collapse",
                    name: "close",
                    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
                        event.currentTarget.closest("dialog")?.close();
                    },
                }}
            />
        </dialog>
    );
    const 

    return (
        <div className="settings">
            <TbSettings size={22} />
        </div>
    );
}

export default Settings;
