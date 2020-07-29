import moment from "moment";

document.getElementById("items").innerHTML = `<p>Loading...</p>`;

const confidenceLevel = (el) => {
  switch (el) {
    case "0":
      return "Gray";
      break;
    case "1":
      return "Red";
      break;
    case "2":
      return "Amber";
      break;
    case "3":
      return "Green";
      break;
    default:
      return "";
  }
};

fetch(
  "https://panelapp.genomicsengland.co.uk/api/v1/panels/signedoff/842/?format=json"
)
  .then((response) => response.json())
  .then((data) => {
    const {
      name,
      version,
      relevant_disorders,
      signed_off,
      types,
      genes,
    } = data;

    const columnsOrder = ["one", "two", "three"];
    const columnOne = columnsOrder[0];
    const columnTwo = columnsOrder[1];
    const columnThree = columnsOrder[2];

    let result = "";

    if (name) {
      result = `    
                <div class='titles'>
                    <div class='row'>
                        <div class='twelve columns'>
                            <h4><b>${name} (Version: ${version})</b></h4>
                            
                            <h6><b>Relevant disorders:</b> ${
                              relevant_disorders.length === 0
                                ? "N/A"
                                : relevant_disorders.map((rd) => rd).join(", ")
                            }</h6>                      
                            <h6><b>Signed off date:</b> ${moment(
                              signed_off
                            ).format("D MMM YYYY")}</h6>
                            <h6><b>Panel types:</b> ${types
                              .map((item) => item.name)
                              .join(", ")}</h6>   
                        </div>
                    </div>
                </div>
                <div class='genes'>
                        <div class='row gene-data'>
                                <div class='${columnOne} columns'><b>Level</b></div>
                                <div class='${columnTwo} columns'><b>Entity</b></div>
                                <div class='${columnThree} columns'><b>Mode of inheritance</b></div>
                                <div class='${columnTwo} columns'><b>Mode of pathogenicity</b></div>
                                <div class='${columnThree} columns'><b>Tags</b></div>
                        </div>
                        ${genes
                          .map(
                            (gene) =>
                              `
                              <div class='row gene-data'>
                                <div class='${columnOne} columns'><span class='confidence-level-badge confidence-level-badge-${confidenceLevel(
                                gene.confidence_level
                              ).toLowerCase()}'>${confidenceLevel(
                                gene.confidence_level
                              )}</span></div>
                                <div class='${columnTwo} columns'><b>${
                                gene.entity_name
                              }</b></div>
                                <div class='${columnThree} columns'>${
                                gene.mode_of_inheritance === ""
                                  ? "N/A"
                                  : gene.mode_of_inheritance
                              }</div>
                                <div class='${columnTwo} columns'>${
                                gene.mode_of_pathogenicity === "" ||
                                gene.mode_of_pathogenicity === null
                                  ? "N/A"
                                  : gene.mode_of_pathogenicity
                              }</div>
                            <div class='${columnThree} columns'>${
                                gene.tags.length === 0
                                  ? "N/A"
                                  : gene.tags
                                      .map(
                                        (tag) =>
                                          `<span class='tag'>${tag}</span>`
                                      )
                                      .join(" ")
                              }</div>
                              </div>
                              `
                          )
                          .join("")}        
                </div>
                `;
      console.log(data);
    } else {
      result = `<p>No data found</p>`;
    }
    document.getElementById("items").innerHTML = result;
  })
  .catch((err) => console.log(err));
