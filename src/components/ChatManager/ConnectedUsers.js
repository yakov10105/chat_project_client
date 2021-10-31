const ConnectedUsers = ({ users }) => <div className='user-list'>
    <h3>Connected Users</h3>
    {users.map((u, idx) => <h4 key={idx}>{u}</h4>)}
</div>

export default ConnectedUsers;