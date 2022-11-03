import Head from 'next/head'
import Image from 'next/image'
import GetDoctor from '../components/GetDoctor'
import Navbar from '../components/Navbar'
import QuickSearch from '../components/QuickSearch'
import SearchBox from '../components/SearchBox'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ayum </title>
        <meta name="title" content="ayum" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        
        <SearchBox/>
        <QuickSearch/>
      <main className={`${''} m-3`}>
       
              
            <GetDoctor/>
            
        
      </main>
            
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/footericon.png" alt="" width={116} height={30} />
             
          </span>
        </a> 
         <br/>
         <div className={styles.footerimg}>
        {/* <Image src="/2.png" alt="" width={50} height={50} /> */}
        </div>
      </footer>
    </div>
  )
}
