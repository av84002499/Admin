import React from 'react';

function Loader() {
    return (
        <div className="position-fixed top-0 start-0 d-flex vh-100 vw-100 z-1 bg-dark bg-opacity-50">
            <div className="d-flex w-100 justify-content-center align-items-center">
                <div className="spinner-grow text-primary" 
                     role="status" 
                     style={{ 
                         width: '6rem', 
                         height: '6rem' 
                     }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
}

export default Loader;