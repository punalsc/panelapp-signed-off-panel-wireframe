import moment from "moment";

document.getElementById("items").innerHTML = `<p>Loading...</p>`;

const confidenceLevel = (el) => {
  switch (el) {
    case "0":
      return "No list";
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
  "https://panelapp.genomicsengland.co.uk/api/v1/panels/signedoff/477/?format=json"
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
      strs,
      regions,
    } = data;

    const arrItems = [...genes, ...strs, ...regions];

    const sortedItems = arrItems.sort((a, b) =>
      a.confidence_level !== b.confidence_level
        ? a.confidence_level > b.confidence_level
          ? -1
          : 1
        : 0
    );

    const columnsOrder = ["two", "three"];
    const [two, three] = columnsOrder;

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
                                <div class='${two} columns'><b>Level</b></div>
                                <div class='${two} columns'><b>Entity</b></div>
                                <div class='${three} columns'><b>Mode of inheritance</b></div>
                                <div class='${two} columns'><b>Mode of pathogenicity</b></div>
                                <div class='${three} columns'><b>Tags</b></div>
                        </div>
                        ${sortedItems
                          .map(
                            (gene) =>
                              `
                              <div class='row gene-data'>
                                <div class='${two} columns'><span class='confidence-level-badge confidence-level-badge-${confidenceLevel(
                                gene.confidence_level
                              ).toLowerCase()}'>${confidenceLevel(
                                gene.confidence_level
                              )}</span></div>
                                <div class='${two} columns'><b>${
                                gene.entity_name
                              }</b>
                              <div>
                                ${gene.tags.map((tag) => {
                                  if (tag === "STR") {
                                    return `<span class="tag--small">${tag}</span>`;
                                  }
                                })}
                                ${
                                  gene.entity_type === "region"
                                    ? `<span class="tag--small">${gene.entity_type}</span>`
                                    : ""
                                }
                              </div>
                              </div>
                                <div class='${three} columns'>${
                                gene.mode_of_inheritance === ""
                                  ? "N/A"
                                  : gene.mode_of_inheritance
                              }</div>
                                <div class='${two} columns'>${
                                gene.mode_of_pathogenicity === "" ||
                                gene.mode_of_pathogenicity === null ||
                                gene.mode_of_pathogenicity === undefined
                                  ? "N/A"
                                  : gene.mode_of_pathogenicity
                              }</div>
                            <div class='${three} columns'>${
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
