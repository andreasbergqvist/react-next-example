import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect } from 'react';
import { Country } from '../interfaces/Country';

interface CountryPageProps {
  country: Country;
}

const CountryPage: React.FC<CountryPageProps> = ({ country }) => {
  useEffect(() => {
    if (country == null) {
      // fetch some other data
    }
  }, []);

  if (country == null) {
    return null;
  }

  return (
    <ul>
      <li>Name: {country.name}</li>
      <li>Capital: {country.capital}</li>
      <li>Continent: {country.continent.name}</li>
      <li>Currency: {country.currency}</li>
    </ul>
  );
};

export const getStaticProps: GetStaticProps<CountryPageProps> = async (
  context
) => {
  //const response = await fetch('https://restcountries.eu/rest/v2/all');
  //const countries = (await response.json()) as Country[];
  //const country = countries.find(
  //  (c) => c.alpha2Code === context.params.countryCode
  //);
  const query = JSON.stringify({
    query: `{ 
      countries {
        name,
        code,
        capital,
        continent {
          name
        },
        currency
      }
    }`,
  });
  const response = await fetch('https://countries.trevorblades.com/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: query,
  });

  const json = await response.json();
  console.log({ errors: json.errors });
  const countries: Country[] = json?.data?.countries ?? [];

  const country =
    countries.find((c) => c.code === context.params.countryCode) ?? null;

  return {
    props: {
      country,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  //const response = await fetch('https://restcountries.eu/rest/v2/all');
  //const countries = (await response.json()) as Country[];
  const paths: { params: { countryCode: string } }[] = [];

  const query = JSON.stringify({
    query: `{ 
      countries {
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

  countries.forEach((c) => {
    paths.push({ params: { countryCode: c.code } });
  });

  return {
    paths,
    fallback: true,
  };
};

export default CountryPage;
