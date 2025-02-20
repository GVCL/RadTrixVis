# RadTrixVis: A Dashboard for Visualizing An Unbalanced Bipartite Graph
_If you use this code in your work, please cite it as follows:_

Reddy Rani Vangimalla, and J. Sreevalsan-Nair, "RadTrix: A Composite Hybrid Visualization for
Unbalanced Bipartite Graphs in Biological Datasets," 9th Eurographics Workshop on Visual Computing for Biology and Medicine, September 2019 (VCBM 2019).
Conference proceedings.

# Set Up and Running the Project  

1. **Clone the Repository**  
   - If you haven't cloned it yet:  
     ```bash
     git clone <repository_url>
     ```  
   - If already cloned:  
     ```bash
     cd <project_folder>
     git pull origin main  # Replace 'main' with the correct branch if needed
     ```  

2. **Install Dependencies**  
   ```bash
   npm install  # Use 'yarn' if preferred
   ```  

3. **Start the Development Server**  
   ```bash
   npm start  # Use 'yarn start' if using Yarn
   ```  
   This launches the app at `http://localhost:3000/`.  

4. **Troubleshooting (if needed)**  
   If you encounter issues after `npm install`, try:  
   ```bash
   rm -rf node_modules
   npm cache clean --force
   npm install
   ```  

Your app should now be running locally! 🚀

# To launch the dashboard

https://gvcl.github.io/RadTrixVis/

# RadTrixVis GUI Tool Help Manual

## About  
**RadTrixVis** is a powerful GUI tool designed for analyzing **gene-phenotype relationships** through phenotype-specific filtering. It enables users to identify significant correlations and network interactions within biological data efficiently.  

---

## Key Features  
- **Phenotype-Specific Filtering**: Three filtering modes—Correlation-Based, Network-Based, and New Data Input—ensure up-to-date visualizations.  
- **Disease Phenotype Section**: Provides phenotype selection, search functionality, and color coding for enhanced clarity.  
- **Gene Section Management**: Features hidden and shown gene lists, search capabilities, and bulk selection actions.  
- **Top K Genes & Customized Gene Selection**: Allows prioritization and filtering of genes based on ranking and selection criteria.  
- **Download Data Panel**: Exports data and visuals in JSON, CSV, and image formats.  
- **Aesthetics Panel**: Customizes color schemes and node ordering to improve visualization clarity.  

---

## Phenotype-Specific Filtering  

RadTrixVis provides three different modes for filtering genes based on phenotype relationships:  

1. **Correlation-Based Filtering**  
   - Identifies and filters genes statistically correlated with a given phenotype.  
   - Uses correlation metrics to determine gene relevance.  

2. **Network-Based Filtering**  
   - Analyzes genes based on their roles within biological networks.  
   - Uses connectivity and network-based algorithms for filtering.  

3. **New Input Data Filtering**  
   - Allows users to upload and analyze custom datasets for tailored phenotype investigations.  
   - Supports various data formats for input.  

---

## Using the Update Data Button  

1. Select **"New Input Data"** mode.  
2. Upload a compatible dataset file.  
3. Click **"Update Data"** to refresh the analysis visuals with the new dataset.  

---

## Disease Phenotype Section  

- **Dropdown Selection**: Users can include/exclude specific phenotypes.  
- **Color-Coded Tags**: Helps visually distinguish different phenotypes for easier analysis.  

---

## Managing Gene Visibility  

- RadTrixVis provides two lists for genes:  
  - **Shown Genes**: Genes currently included in the analysis.  
  - **Hidden Genes**: Genes excluded but still available for selection.  
- **Search & Bulk Selection**:  
  - Use the search function to find specific genes quickly.  
  - Checkboxes allow bulk actions to show or hide multiple genes at once.  

---

## Top K Genes Inclusion  

- Users can specify the number of **top-ranked genes** to focus on.  
- Selection is based on ranking metrics relevant to the phenotype analysis.  

---

## Customized Gene Selection  

- Allows **rank-based filtering** from a range of specified ranks.  
- Users can adjust **step sizes** to fine-tune gene selection granularity.  

---

## Data and Image Export Options  

RadTrixVis supports multiple export formats to suit different analysis needs:  

- **JSON**: Structured data export for further processing.  
- **CSV**: Tabular format for spreadsheet and statistical tool compatibility.  
- **Image Formats**: Export visual representations for reports and presentations.  

---

## Aesthetics Customization  

Users can adjust visualization settings to enhance interpretability:  

1. **Phenotype & Gene Colors**  
   - Assign specific colors to different phenotypes and gene nodes.  
   - Helps create distinct visual categories in network graphs.  

2. **Node Ordering**  
   - Order nodes based on:  
     - **Degree** (importance in the network)  
     - **Random** (for unbiased visualization)  
     - **Lexicographical** (alphabetical sorting for structured layouts)  

---

## Summary of Steps  

1. **Choose Filtering Mode**: Correlation-Based, Network-Based, or New Input Data.  
2. **Upload Data (if required)** and click **Update Data** to refresh visuals.  
3. **Manage Phenotypes**: Use dropdown selection and color-coded tags.  
4. **Control Gene Visibility**: Use checkboxes, search, and bulk selection.  
5. **Select Top K Genes or Customized Gene Range** for focused analysis.  
6. **Customize Aesthetics**: Adjust colors and node ordering for better clarity.  
7. **Export Data & Visuals** in JSON, CSV, or image formats.  

---

