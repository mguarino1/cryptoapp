import { TokenProps } from "../App"

export const TokenCard = (props: TokenProps) => {
    
    let style = {};
    props.flag === 1 ? style = {color: 'green'} : style = {color: 'red'};

    return (
        <div className="TokenCard" style={style}>
            <p className="TokenSymbol">{props.symbol}</p>
            <p className="TokenPrice">{props.price >= 1 ? props.price.toFixed(2) : props.price}</p>
        </div>
    )
}
