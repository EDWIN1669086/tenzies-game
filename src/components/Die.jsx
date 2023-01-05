
function Die({value, isHeld, holdDice}){
    const styles = {
        backgroundColor: isHeld ? "#59E391" : "white"
    }

    const Pip = () => <span className="pip" />
    const Face = ({children}) => <div className="face">{children}</div>

    let pips = Number.isInteger(value) ? Array(value).fill(0).map((_,i) => <Pip key={i} />) : null;

return (
        <div className="die-face" style={styles} onClick={holdDice}>
            <Face>{pips}</Face>
        </div>
    )
}
export default Die
