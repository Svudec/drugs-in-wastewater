import './App.css';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


function About() {

    const [markdown, setMarkdown] = useState('')

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/Svudec/drugs-in-wastewater/master/README.md')
            .then(res => res.text().then(t => setMarkdown(t)))
    }, [])

    return (
        <div>
            <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
        </div>
    );
}

export default About;
