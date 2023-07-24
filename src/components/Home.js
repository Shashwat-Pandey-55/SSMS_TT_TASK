import Tasks from './Tasks';

export const Home = (props) => {
    const {showAlert} = props
    return (
        <div>
          
        <Tasks showAlert={showAlert} />
    </div>
    )
}

export default Home;