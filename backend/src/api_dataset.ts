import { Type, Static } from "@sinclair/typebox";
import { StringEnum } from "./type_utils";

/* ============================= */
/* ====== Type definition ====== */
/* ============================= */

export const DataSetSchema = Type.Object({
  id: Type.String(),
  name: Type.String(), // Database Table Name
  info: Type.Object({
    name: Type.String(),
    description: Type.String(),
    category: StringEnum([
      "Climate",
      "Research",
      "Education",
      "Transporation",
      "Healthcare",
      "Economics",
      "Social",
      "Blockchain",
      "Encyclopedic",
      "Financial services",
      "Other",
    ]),
    is_verified: Type.Optional(Type.Boolean()),
  }),
});

export const GetListResponseSchema = Type.Array(DataSetSchema);

export type DataSet = Static<typeof DataSetSchema>;

export type GetListResponse = Static<typeof GetListResponseSchema>;

/* ================================ */
/* ====== API implementation ====== */
/* ================================ */

export async function getList(): Promise<GetListResponse> {
  return [
    {
      id: "1",
      name: "gharchive_dev.github_events",
      info: {
        name: "GitHub Events",
        description:
          "Includes activity from over 3M open source GitHub repositories",
        category: "Encyclopedic",
      },
    },
    {
      id: "2",
      name: "abnb",
      info: {
        name: "Airbnb Stock",
        description: "Historical stock price of Airbnb (ticker symbol ABNB)",
        category: "Financial services",
      },
    },
    {
      id: "3",
      name: "bakery",
      info: {
        name: "Bakery Orders",
        description:
          "The transaction details of customers who ordered different items from The Bread Basket",
        category: "Other",
      },
    },
    {
      id: "4",
      name: "bankmarketing",
      info: {
        name: "Bank marketing",
        description:
          "The banking marketing dataset for the customer, contains various details of the Banking Customers like their Marital Status, whether they defaulted on loan or no",
        category: "Other",
      },
    },
    {
      id: "5",
      name: "bigmacprice",
      info: {
        name: "BigMac Price",
        description: "Mcdonalds' BigMac prices in many countries",
        category: "Other",
      },
    },
    {
      id: "6",
      name: "cancer_patient_data_sets",
      info: {
        name: "Cancer Patient",
        description: "Info about cancer patients about their lifestyles",
        category: "Healthcare",
      },
    },
    {
      id: "7",
      name: "cars_india",
      info: {
        name: "Cars - India",
        description: "Cars in India",
        category: "Transporation",
      },
    },
    {
      id: "8",
      name: "city_population_china",
      info: {
        name: "Population - China",
        description: "China city population",
        category: "Social",
      },
    },
    {
      id: "9",
      name: "consolidated_data_set_anac2",
      info: {
        name: "Youtube Videos",
        description:
          "The idea is the figure out the success ratio of youtube content creators and answer some of the basic questions like, how videos is takes for a channel to become successful, what language to choose, what type of content works and establish proof of success with Data and help them make a decision. Hence the entire team of Business Analyst Interns at KultureHire took the responsibility of collecting and cleaning the data and brought it to an decent shape. The dataset has 22 fields/columns and over 900 rows or 900 different videos from various youtube channels to it.",
        category: "Other",
      },
    },
    {
      id: "10",
      name: "countries_gdp",
      info: {
        name: "Countries GDP",
        description: "World wide countries GDP",
        category: "Economics",
      },
    },
    {
      id: "11",
      name: "country_population",
      info: {
        name: "Countries Population",
        description: "World wide countries population",
        category: "Social",
      },
    },
    {
      id: "12",
      name: "curitiba_apartment_real_estate_data",
      info: {
        name: "Real Estate",
        description:
          "Collected data from public real estate listing sources of Curitiba City (capital of Parana) in Brazil.",
        category: "Encyclopedic",
      },
    },
    {
      id: "13",
      name: "data_cleaned_2021",
      info: {
        name: "Glassdoor Salary",
        description:
          "The dataset is scraped from the Glassdoor website using Selenium scrapper. After scrapping, the raw dataset was cleaned and made usable for performing data analysis and modelling. The dataset contains information about the minimum salary, maximum salary, average salary, job description, age of the company in years, etc.",
        category: "Encyclopedic",
      },
    },
    {
      id: "14",
      name: "data_science_fields_salary_categorization",
      info: {
        name: "Data Science Fields Salary",
        description: "Data Science Fields Salary Categorization Dataset",
        category: "Social",
      },
    },
    {
      id: "15",
      name: "day",
      info: {
        description: "Global weathers",
        name: "Weather",
        category: "Climate",
      },
    },
    {
      id: "16",
      name: "diabetes",
      info: {
        description:
          "This dataset is originally from the National Institute of Diabetes and Digestive and Kidney Diseases. The objective is to predict based on diagnostic measurements whether a patient has diabetes.",
        name: "Diabete",
        category: "Healthcare",
      },
    },
    {
      id: "17",
      name: "disney_plus_titles",
      info: {
        description:
          "Disney+ is another one of the most popular media and video streaming platforms. They have close to 1300 movies or tv shows available on their platform, as of mid-2021, they have over 116M Subscribers globally. This tabular dataset consists of listings of all the movies and tv shows available on Amazon Prime, along with details such as - cast, directors, ratings, release year, duration, etc.",
        name: "Disney+ Medias",
        category: "Encyclopedic",
      },
    },
    {
      id: "18",
      name: "exchange_rate",
      info: {
        description:
          "The data set consist currency exchange rate of different countries since 1950.",
        name: "Concurrency Exchange",
        category: "Financial services",
      },
    },
    {
      id: "19",
      name: "fifa_23_players_data",
      info: {
        description: "Fifa 23 Players Dataset - Official Ratings and Stats.",
        name: "FIFA 23 Players",
        category: "Other",
      },
    },
    // {
    //   id: "20",
    //   name: "final_book_dataset_kaggle",
    //   info: {
    //     description: "Book dataset.",
    //     name: "Weather",
    //     category: "Climate",
    //   },
    // },
    {
      id: "20",
      name: "transaction",
      info: {
        description: "A Real-Time NFT transactions dataset.",
        name: "NFT transactions dataset",
        category: "Blockchain",
      },
    },
    {
      id: "21",
      name: "five_years_weather_data",
      info: {
        description: "Five years weather dataset.",
        name: "Weather",
        category: "Climate",
      },
    },
    {
      id: "22",
      name: "fortune_1000_companies_by_revenue",
      info: {
        description: "Fortune Top 1000 Companies by Revenue 2022.",
        name: "Fortune Top 1000",
        category: "Encyclopedic",
      },
    },
    // {
    //   id: "23",
    //   name: "hr_rmployee_attrition",
    //   info: {
    //     description:
    //       "HR Employee Attrition to find and filter the criteria which are most responsible for attrition",
    //     name: "Weather",
    //     category: "Climate",
    //   },
    // },
    {
      id: "24",
      name: "imdb_top_250_series_episode_ratings",
      info: {
        description: "IMDb top 250 series episode ratings.",
        name: "IMDb Top 250 Ratings",
        category: "Encyclopedic",
      },
    },
    {
      id: "25",
      name: "imdb_top_250_series_global_ratings",
      info: {
        description: "IMDb top 250 series global ratings.",
        name: "IMDb Top 250 Ratings",
        category: "Encyclopedic",
      },
    },
    {
      id: "26",
      name: "international_matches",
      info: {
        description: "International matches dataset.",
        name: "International Matches",
        category: "Other",
      },
    },
    {
      id: "27",
      name: "lgbt_tweets_processed",
      info: {
        description:
          "The LGBT community faces a lot of challenges and societal stigma. This dataset could be used to analyze how people in social media views the LGBT community and gain insights about the different perspectives coming out from different people. This might help tackle issues like inclusion, equal rights, empowered social engagements, and societal acceptance.",
        name: "LGBT Tweets",
        category: "Other",
      },
    },
    {
      id: "28",
      name: "ndma_data_floods",
      info: {
        description: "Floods in Pakistan 2022 latest NDMA dataset.",
        name: "Floods",
        category: "Climate",
      },
    },
    {
      id: "29",
      name: "nigerian_car_prices",
      info: {
        description:
          "This data was scraped from cars45.com which is an online marketplace in Nigeria which connects buyers with sellers of used cars.",
        name: "Car Marketplace",
        category: "Encyclopedic",
      },
    },
    {
      id: "30",
      name: "owid_covid_data",
      info: {
        description:
          "The complete COVID-19 dataset is a collection of the COVID-19 data maintained and provided by Our World in Data.",
        name: "COVID-19 Data",
        category: "Healthcare",
      },
    },
    // {
    //   id: "31",
    //   name: "samplesuperstore",
    //   info: {
    //     description:
    //       "This is a sample superstore dataset, a kind of a simulation where you perform extensive data analysis to deliver insights on how the company can increase its profits while minimizing the losses.",
    //     name: "Weather",
    //     category: "Climate",
    //   },
    // },
    {
      id: "32",
      name: "supermarket_sales",
      info: {
        description: "Super market sales dataset.",
        name: "Super Market Sales",
        category: "Other",
      },
    },
    {
      id: "33",
      name: "tennis_player_rankings",
      info: {
        description:
          "Tennis player rankings dataset. Mens Top 100 Year End rankings, 1973-2021, from https://www.atptour.com/en/rankings",
        name: "Tennis players",
        category: "Encyclopedic",
      },
    },
    {
      id: "34",
      name: "transfusion",
      info: {
        description:
          "Dataset comes from a mobile blood donation vehicle in Taiwan. The Blood Transfusion Service Center drives to different universities and collects blood as part of a blood drive. We want to predict whether or not a donor will give blood the next time the vehicle comes to campus.",
        name: "Blood Transfusion",
        category: "Other",
      },
    },
    {
      id: "35",
      name: "trending_videos_on_youtube",
      info: {
        description: "Trending videos on youtube dataset.",
        name: "Trending videos on Youtube",
        category: "Encyclopedic",
      },
    },
    {
      id: "36",
      name: "unemployment_analysis",
      info: {
        description: "Unemployment dataset",
        name: "Unemployment",
        category: "Social",
      },
    },
    // {
    //   id: "37",
    //   name: "violence_against_women_girls_data",
    //   info: {
    //     description:
    //       "The data was taken from a survey of men and women in African, Asian, and South American countries, exploring the attitudes and perceived justifications given for committing acts of violence against women. The data also explores different sociodemographic groups that the respondents belong to, including: Education Level, Marital status, Employment, and Age group.",
    //     name: "Weather",
    //     category: "Climate",
    //   },
    // },
    {
      id: "38",
      name: "world_cheese_awards_2021",
      info: {
        description: "World cheese awards 2021 dataset.",
        name: "World cheese awards",
        category: "Encyclopedic",
      },
    },
    {
      id: "39",
      name: "world_wide_unicorn_startups",
      info: {
        description: "World wide unicorn startups dataset.",
        name: "Unicorn startups",
        category: "Encyclopedic",
      },
    },
    {
      id: "40",
      name: "worldhappiness_corruption_2015_2020",
      info: {
        description: "World happiness corruption dataset from 2015 to 2020.",
        name: "Happiness Corruption",
        category: "Encyclopedic",
      },
    },
  ];
}
