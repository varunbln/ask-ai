import './Main.css';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@wasp/queries';
import searchEmbeddings from '@wasp/queries/searchEmbeddings';

const MainPage = () => {
  const [query, setQuery] = useState('');
  const [currentSubject, setCurrentSubject] = useState('Supply Chain Management');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // we keep to keep the query disabled until the user enters a query
  // then we refetch() on demand in handeSearch()
  const { data, isFetching, refetch } = useQuery(
    searchEmbeddings,
    { inputQuery: query, resultNum: 3, subject: currentSubject },
    { enabled: false }
  );

  const onSubjectChange = (event: any) => {
    const index = event.nativeEvent.target.selectedIndex;
    const subject = event.nativeEvent.target[index].text
    setCurrentSubject(subject);
  }

  const handleSearch = async () => {
    if (!textAreaRef.current) return;
    refetch();
  };

  interface SubjectFiles {
    [subject: string]: string[];
  }

  const subjectFiles: SubjectFiles = {
    "Fundamentals of Business Analytics": [
      "Introduction to Business Analytics",
      "Data Analytic Thinking"
    ],
    "Supply Chain Management": [
      "Introduction",
      "Pricing and Revenue Management",
      "Capacity and Location Planning"
    ],
    "Digital Marketing": [
      "Introduction to Digital Marketing",
      "Search Marketing",
      "Social Media and Content Marketing",
      "Display Advertising",
    ],
    "Finance and Accounting": [
      "Introduction to Accounting",
      "Accounting Policies",
      "Accounting Concepts and Conventions",
      "Key Terms Notes"
    ],
    "Social Network Analysis": [
      "Introduction to Social Web",
      "Network Visualization",
      "Tie Strength",
      "Link Prediction",
      "Network Propagation",
      "Community Discovery"
    ]
  }

  return (
    <div className='min-h-screen bg-stone-900 text-stone-100'>
      <div className='w-full sm:w-2/3 mx-auto'>
        <div className='py-7 flex flex-col items-center'>
          <div className='flex md:pl-0 md:pr-0 pl-7 pr-7 flex-col pb-7 justify-center items-center'>
            <h1 className='text-xl ml-1'>Ask AI about anything in the course material!</h1>
            <p className="text-l pt-4">Select the subject you want to ask questions about, then simply ask and wait for AI to do its magic.</p>
            <p>This project performs Retrieval Augmented Generation(RAG) using embeddings generated from course material.</p>
          </div>
          <div className='flex pb-7 items-center justify-evenly w-full'>
            <div className='w-2/6 border-t border-neutral-700'></div>
            <span className='text-yellow-300 text-center font-black'> AskAI </span>
            <div className='w-2/6 border-t border-neutral-700'></div>
          </div>
          <div className='flex-col md:flex-row md:flex md:space-x-12 justify-center w-full'>
            <div className='flex flex-col rounded-lg border border-neutral-700 p-7 w-full'>
              <div className='flex items-center space-x-2'>
                <div className='font-bold pb-2'> Select the subject: </div>{' '}
              </div>
              <select className="bg-stone-100 text-stone-950" name="subjects" id="subject-selectors" onChange={onSubjectChange}>
                <option>Supply Chain Management</option>
                <option>Fundamentals of Business Analytics</option>
                <option>Digital Marketing</option>
                <option>Finance and Accounting</option>
                <option>Social Network Analysis</option>
              </select>
              <div className='font-bold pt-2'> 📁 Subject Files: </div>{' '}
              <ul className='indent-6'>
                {subjectFiles[currentSubject].map((subjectFile, index) => {
                  return <li key={index}>* {subjectFile}</li>
                })}
              </ul>
            </div>
            <div className='flex flex-col justify-between rounded-lg border border-neutral-700 p-7 w-full'>
              <textarea
                ref={textAreaRef}
                onChange={(e) => setQuery(e.target.value)}
                className='shadow appearance-none border border-neutral-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                placeholder='Enter your question'
              />
              {!isFetching ? (
                <button
                  className='shadow px-2 py-1 text-neutral-700 bg-yellow-400 rounded whitespace-nowrap'
                  onClick={handleSearch}
                >
                  🔎 Find the Answer
                </button>
              ) : (
                <button
                  className='shadow px-2 py-1 text-neutral-700 bg-yellow-400 rounded whitespace-nowrap opacity-50'
                  disabled
                >
                  🔎 Thinking...
                </button>
              )}
            </div>
          </div>
        </div>
        <div className='flex justify-center items-center '>
          {data && data.length > 0 && (
            <div className='border border-neutral-700 rounded-lg w-full p-7 grid grid-rows-3 gap-7'>
              <div
                className='border border-neutral-500 flex flex-col p-7 bg-yellow-400 text-stone-950 rounded-lg'
              >
                <div>
                  <div className='font-bold mr-2'>Answer:</div> {data}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MainPage;
