from taxii2client.v21 import Server, ApiRoot
import sys, getopt
import json

#Initialize user input variables
url = ""
apiroot_name = ""
collection_id = ""
user = ""
password = ""

#Arguments
opts, args = getopt.getopt(sys.argv[1:],"hu:a:c:np",["url=","apiroot=","collection=","username=","password="])
for opt, arg in opts:
    if opt in ("-h", "--help"):
        print ('stig-client.py -u <url> -a <apiroot name> -c <collection id> -n <username> -p <password>')
        sys.exit()
    elif opt in ("-u", "--url"):
        url = arg
    elif opt in ("-a", "--apiroot"):
        apiroot_name = arg
    elif opt in ("-c", "--collection"):
        collection_id = arg
    elif opt in ("-n", "--username"):
        user = arg
    elif opt in ("-p", "--password"):
        password = arg

err = ""
user_objs = []

# URL check
if url == "":
    err = "URL cannot be blank"

# Collection ID check
if collection_id != "":
    if apiroot_name != "":
        api_url = url + "/" + apiroot_name
        print(api_url)
        api_root = ApiRoot(url=api_url, user='admin', password='admin')

        col = {}

        try:
            for collections in api_root.collections:
                col[collections.id] = collections 
        except:
            print('')

        collection = col[collection_id]
        print(collection.get_objects())
    else:
        server = Server(url, user='admin', password='admin')

        col = {}

        for api_root in server.api_roots:
            collections = api_root.collections
            try:
                for collection in collections:
                    col[collection.id] = collection
            except:
                print('')
                continue

        user_col = col[collection_id]
        user_objs = user_col.get_objects()
        #print(user_objs)
    
else:
    err = "Collection ID cannot be blank"


with open('temp_stix_taxii.json', 'w', encoding='utf-8') as f:
    json.dump(user_objs, f, ensure_ascii=False, indent=4)
f.close()
#print(err)
