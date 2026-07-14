type SummaryCardProps = {
    
    title: string;
    value: string;
};

// using props
// function SummaryCard(props: SummaryCardProps) {
    
//     return(
//         <div className="summary-card">
//             <p>{props.title}</p>
//             <h2>{props.value}</h2>
//         </div>
//     );
// }

// props destructuring
function SummaryCard({title, value}: SummaryCardProps) {
    
    return(
        <div className="summary-card">
            <p>{title}</p>
            <h2>{value}</h2>
        </div>
    );
}

export default SummaryCard;