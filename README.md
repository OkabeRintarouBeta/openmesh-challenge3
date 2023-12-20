# OpenMesh Challenge 3 - Tokenomics Visualizer

Welcome to the Tokenomics Visualizer, an innovative web application tailored for real-time visualization and analysis of cryptocurrency metrics. In the complex world of crypto trading and investment, understanding the nuances of tokenomics is crucial yet often challenging. While price is a primary focus for many, the circulating supply of tokens plays an equally significant role in shaping market dynamics.

Our application addresses this gap by offering intuitive and interactive visualizations in two key areas:

1. **Graphs for Comparative Analysis**:
   - Users can select and compare different cryptocurrencies.
   - The application visualizes the relationship between token supply and price over time on a dynamic graph.
   - This feature aims to provide users with a deeper understanding of how the supply of a cryptocurrency evolves and impacts its market value.

2. **Pie Charts for Distribution Insights**:
   - Users can input the initial supply of a token along with various data fields representing different groups or stakeholders.
   - The application then generates a pie chart to visualize the distribution of this initial supply among the specified groups.
   - This visualization helps users comprehend how a cryptocurrency's initial supply is allocated, which is then integrated into the comparative graphs for a holistic view of tokenomics.

The Tokenomics Visualizer is more than just a tool; it's a gateway to informed decision-making in cryptocurrency investment and trading. By bridging the gap between complex data and user-friendly visualization, we aim to empower users with a clearer understanding of the crypto market.


## Project Overview

This project is part of the OpenMesh Challenge 3, aimed at showcasing the capabilities of handling and visualizing large-scale, real-time data. Our application provides an intuitive interface for users to interact with and understand complex data sets, with a focus on cryptocurrency tokenomics.

Currently, our application primarily features data related to Ethereum, which serves as the default cryptocurrency when users first visit the app. This focused approach allows us to provide detailed and specific insights into Ethereum's tokenomics, offering a comprehensive understanding of its market behavior and supply dynamics.

For the scope of this hackathon, we believe that concentrating on Ethereum data provides substantial value and a solid foundation for our application. Ethereum, being one of the most prominent cryptocurrencies, offers a rich dataset that is representative of broader market trends and behaviors.

Looking ahead, we had envisioned expanding our application to include a diverse range of cryptocurrencies. This expansion would enable users to select from multiple options, thereby broadening their analysis and comparison capabilities. While time constraints have limited us to Ethereum for this hackathon, we are excited about the potential to incorporate additional cryptocurrencies in the future. This enhancement would not only add depth to the analysis but also provide a more versatile tool for users interested in various segments of the crypto market.


## Technology Stack

- **Frontend**:
  - **React**: For building the user interface.
  - **Chart.js and React-Chartjs-2**: For data visualization (line and pie charts).
  - **Material-UI**: For styling and layout components.
- **Backend**:
  - Please refer to our backend repo here.


## Setup and Installation

1. **Clone the Repository**:
   ```
   git clone https://github.com/OkabeRintarouBeta/openmesh-challenge3.git
   cd openmesh-challenge3
   ```

2. **Install Dependencies** (Frontend):
   ```
   cd frontend/dashboard
   npm install
   ```

3. **Run the Application**:
   ```
   npm start
   ```
   This will start the React application on `localhost:3000`.


## Features

- **Real-Time Data Visualization**: Interactive line and pie charts displaying cryptocurrency data.
- **User Interaction**: Capability for users to customize data views and inputs.


## Contributing

We welcome contributions to this project! Please refer to our contributing guidelines for more information on how to participate.


## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.
