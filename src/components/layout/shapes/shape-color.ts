export function getColorByOwner(owner: string) {

    if (owner === "EE") {
        return "#a5c8e1"
    }
    if (owner === "Automation") {
        return "#89a7bc"
    }
    if (owner === "Production") {
        return "#89a7bc"
    }
    if (owner === "Test") {
        return "#f0c789"
    }

    return "#a5c8e1"
}