``` mermaid
graph TD;
    %% Main System Components %%
    A1(User Query) -->|Triggers| B1(Event Research AI);
    A1 -->|Triggers| B2(Accommodation & Travel AI);
    A1 -->|Triggers| B3(Restaurants & Dining AI);
    A1 -->|Triggers| B4(Content & SEO AI);
    A1 -->|Triggers| B5(Monetization AI);
    
    %% Event Research Agent %%
    B1 -->|Scrapes & Retrieves Data| C1(Event APIs);
    B1 -->|Stores in| D1(Vector Database);
    D1 -->|Feeds to| E1(HTE Insights Generator);

    %% Accommodation & Travel Agent %%
    B2 -->|Fetches Data| C2(Expedia API);
    B2 -->|Fetches Data| C3(Booking.com API);
    B2 -->|Fetches Data| C4(Car Rental APIs);
    B2 -->|Stores in| D1;

    %% Restaurants & Dining Agent %%
    B3 -->|Scrapes Reviews| C5(Yelp API);
    B3 -->|Scrapes Listings| C6(Google Places API);
    B3 -->|Stores in| D1;

    %% Content & SEO Optimization Agent %%
    B4 -->|Optimizes Content| C7(SEO Analyzer);
    B4 -->|Fetches City Insights| C8(RAG from Vector DB);
    B4 -->|Writes Blog| E2(Content Writer AI);

    %% Monetization & Affiliate Strategy Agent %%
    B5 -->|Fetches Affiliate Links| C9(Affiliate APIs);
    B5 -->|Analyzes User Clicks| C10(Analytics Tracker);
    B5 -->|Feeds Monetized Content| E3(AdSense & CTA Generator);
    
    %% Writer AI Agent %%
    E1 -->|Sends HTE Insights| E2;
    E2 -->|Generates Structured Article| F1(Formatted Article);
    E3 -->|Injects Monetization| F1;
    
    %% Final Output %%
    F1 -->|Publishes to| G1(HTE Travel Guide Platform);

    %% Orchestration %%
    subgraph "Inngest AI Agent Orchestration"
        B1
        B2
        B3
        B4
        B5
        E1
        E2
        E3
    end


```