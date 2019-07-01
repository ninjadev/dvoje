import glob
import json
import xml.etree.ElementTree as ET


models = {}

for filename in glob.glob('*.dae'):
    data = None
    with open(filename, 'r') as in_file:
        # Collada breaks xml conventions by using colon to store some booleans
        # so we have to remove it to parse the file
        data = in_file.read().replace(':enable', '')


    parts = []

    nodes = ET.fromstring(data).find('{http://www.collada.org/2005/11/COLLADASchema}library_nodes')[0]
    for instance_node in nodes:
        part = {}

        part['id'] = instance_node.get('id')
        part['matrix'] = [float(value) for value in instance_node[0][0].text.split(' ')]
        part['partname'] = instance_node[0][1].get('url')

        parts.append(part)

    models[filename[:-3]] = parts

with open('lego_models.json', 'w') as out_file:
    out_file.write(json.dumps(models))
