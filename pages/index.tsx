import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Country } from '../interfaces/Country';

interface IndexProps {
  countries: Country[];
}

const Home: React.FC<IndexProps> = ({ countries }) => {
  return (
    <div className="container">
      <Head>
        <title>Countries</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {countries.map((country) => (
          <p key={country.code}>
            <Link href={`/${country.code}`} passHref>
              <a>{country.name}</a>
            </Link>
          </p>
        ))}
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  //const response = await fetch('https://restcountries.eu/rest/v2/all');
  //const countries = (await response.json()) as Country[];

  const query = JSON.stringify({
    query: `{ 
    countries {
      name,
      code,
    }
  }`,
  });
  const response = await fetch('https://countries.trevorblades.com/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: query,
  });

  const countries: Country[] = (await response.json()).data.countries;

  return {
    props: {
      countries,
    },
  };
};

export default Home;
